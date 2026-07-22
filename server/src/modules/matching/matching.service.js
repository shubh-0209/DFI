const User = require('../user/user.model');
const Program = require('../program/program.model');
const Application = require('../application/application.model');
const SavedRecommendation = require('./recommendation.model');
const { PROGRAM_STATUS } = require('../program/program.constants');
const { MATCHING_WEIGHTS } = require('./matching.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const Notification = require('../notification/notification.model');
const { NOTIFICATION_TYPES, PRIORITY } = require('../notification/notification.constants');

class MatchingService {
  async getProgramRecommendations(user, query) {
    const targetUserId = query.userId || (user._id || user.id);

    const targetUser = await User.findById(targetUserId).select(
      'name skills interests languages availability city state hoursCompleted certificatesEarned programsCompleted programsJoined role profilePhoto'
    );

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    if (targetUserId !== (user._id || user.id) && user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'coordinator') {
      throw new NotFoundError('User not found');
    }

    const search = (query.search || '').toLowerCase().trim();
    let programs = await Program.find({ status: PROGRAM_STATUS.PUBLISHED, isDeleted: false }).lean();

    const savedOrDismissed = await SavedRecommendation.find({
      user: targetUserId,
      program: { $ne: null }
    }).select('program').lean();
    const excludedProgramIds = new Set(savedOrDismissed.map((r) => r.program.toString()));
    programs = programs.filter((p) => !excludedProgramIds.has(p._id.toString()));

    if (search) {
      programs = programs.filter((p) => {
        const text = [p.title, p.shortDescription, p.description, p.category, ...(p.tags || [])].join(' ').toLowerCase();
        return text.includes(search);
      });
    }

    const recommendations = programs.map((program) => this._calculateMatchScore(targetUser, program));

    recommendations.sort((a, b) => b.score - a.score);

    let filtered = recommendations;
    if (query.minScore) {
      const min = parseInt(query.minScore, 10);
      filtered = recommendations.filter((r) => r.score >= min);
    }
    if (query.programCategory) {
      filtered = filtered.filter((r) => (r.programCategory || '').toLowerCase() === query.programCategory.toLowerCase());
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      recommendations: paginated,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        hasNextPage: start + limit < filtered.length,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getVolunteerRecommendations(user, query) {
    const programId = query.programId;
    if (!programId) {
      throw new ValidationError('programId is required');
    }

    const program = await Program.findById(programId).lean();
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const volunteers = await User.find({ role: 'volunteer', isDeleted: false })
      .select(
        'name skills interests languages availability city state hoursCompleted certificatesEarned programsCompleted programsJoined profilePhoto'
      )
      .lean();

    const savedOrDismissed = await SavedRecommendation.find({
      user: (user._id || user.id),
      program: programId,
      volunteer: { $ne: null }
    }).select('volunteer').lean();
    const excludedVolunteerIds = new Set(savedOrDismissed.map((r) => r.volunteer.toString()));
    const availableVolunteers = volunteers.filter((v) => !excludedVolunteerIds.has(v._id.toString()));

    const search = (query.search || '').toLowerCase().trim();
    let filteredVolunteers = availableVolunteers;
    if (search) {
      filteredVolunteers = availableVolunteers.filter((v) => {
        const text = [v.name, ...(v.skills || []), ...(v.interests || []), v.city, v.state].join(' ').toLowerCase();
        return text.includes(search);
      });
    }

    const recommendations = filteredVolunteers.map((volunteer) => this._calculateMatchScore(volunteer, program));
    recommendations.sort((a, b) => b.score - a.score);

    let finalRecs = recommendations;
    if (query.minScore) {
      const min = parseInt(query.minScore, 10);
      finalRecs = recommendations.filter((r) => r.score >= min);
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;
    const paginated = finalRecs.slice(start, start + limit);

    return {
      recommendations: paginated,
      pagination: {
        total: finalRecs.length,
        page,
        limit,
        totalPages: Math.ceil(finalRecs.length / limit),
        hasNextPage: start + limit < finalRecs.length,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getDetailedRecommendation(user, query) {
    const programId = query.programId;
    if (!programId) {
      throw new ValidationError('programId is required');
    }

    const targetUserId = query.userId || (user._id || user.id);
    const volunteer = await User.findById(targetUserId).lean();
    if (!volunteer) {
      throw new NotFoundError('User not found');
    }

    if (targetUserId !== (user._id || user.id) && user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'coordinator') {
      throw new NotFoundError('User not found');
    }

    const program = await Program.findById(programId).lean();
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const pastApplications = await Application.find({
      user: targetUserId,
      status: { $in: ['joined', 'completed'] },
      isDeleted: false,
    })
      .populate('program', 'tags category')
      .lean();

    const relatedPastProgramCount = pastApplications.filter((app) => {
      if (!app.program) return false;
      const pTags = (app.program.tags || []).map((t) => t.toLowerCase());
      const pCat = (app.program.category || '').toLowerCase();
      const vSkills = (volunteer.skills || []).map((s) => s.toLowerCase());
      const vInterests = (volunteer.interests || []).map((s) => s.toLowerCase());
      return (
        vSkills.some((s) => pTags.includes(s) || pCat.includes(s)) ||
        vInterests.some((i) => pTags.includes(i) || pCat.includes(i))
      );
    }).length;

    const detail = this._calculateMatchScore(volunteer, program, relatedPastProgramCount, true);
    return detail;
  }

  async saveRecommendation(user, payload) {
    const { programId, volunteerId, score, reasonForRecommendation, matchingSkills, missingSkills, metadata } = payload;

    if (!programId && !volunteerId) {
      throw new ValidationError('Either programId or volunteerId is required');
    }

    if (programId) {
      const existing = await SavedRecommendation.findOne({ user: (user._id || user.id), program: programId, isDeleted: false });
      if (existing) {
        return { ...existing.toJSON(), alreadySaved: true };
      }
    }

    if (volunteerId) {
      const existing = await SavedRecommendation.findOne({ user: (user._id || user.id), volunteer: volunteerId, isDeleted: false });
      if (existing) {
        return { ...existing.toJSON(), alreadySaved: true };
      }
    }

    const saved = await SavedRecommendation.create({
      user: (user._id || user.id),
      program: programId || null,
      volunteer: volunteerId || null,
      score,
      reasonForRecommendation,
      matchingSkills,
      missingSkills,
      metadata: metadata || {},
    });

    const savedRecord = saved.toJSON();
    const programTitle = programId ? (await Program.findById(programId).lean())?.title : null;
    const volunteerName = volunteerId ? (await User.findById(volunteerId).lean())?.name : null;

    this.sendSavedRecommendationNotification(user, {
      programId: saved.program,
      volunteerId: saved.volunteer,
      programTitle: programTitle || 'Program',
      volunteerName: volunteerName || 'Volunteer',
      score: saved.score,
    });

    return { ...savedRecord, alreadySaved: false };
  }

  async unsaveRecommendation(user, recommendationId) {
    const saved = await SavedRecommendation.findOne({ _id: recommendationId, user: (user._id || user.id), isDeleted: false });
    if (!saved) {
      throw new NotFoundError('Saved recommendation not found');
    }

    saved.isDeleted = true;
    saved.deletedAt = new Date();
    saved.deletedBy = (user._id || user.id);
    await saved.save();

    const isProgram = !!saved.program;
    const title = isProgram ? 'Recommendation Dismissed' : 'Volunteer Match Dismissed';
    const message = isProgram
      ? 'A program recommendation was dismissed from your list.'
      : 'A volunteer match was dismissed from your list.';

    await Notification.create({
      recipient: (user._id || user.id),
      sender: null,
      title,
      message,
      type: NOTIFICATION_TYPES.RECOMMENDATION_SAVED,
      category: 'recommendation',
      priority: PRIORITY.LOW,
      channel: 'in-app',
      relatedEntityType: isProgram ? 'program' : 'volunteer',
      relatedEntityId: isProgram ? saved.program : saved.volunteer,
    });

    return { success: true };
  }

  async getSavedRecommendations(user, query) {
    const filter = { user: (user._id || user.id), isDeleted: false };

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;

    const [items, total] = await Promise.all([
      SavedRecommendation.find(filter)
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .lean(),
      SavedRecommendation.countDocuments(filter),
    ]);

    return {
      savedRecommendations: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: start + limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getRecommendationHistory(user, query) {
    const targetUserId = query.userId || (user._id || user.id);

    if (targetUserId !== (user._id || user.id) && user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'coordinator') {
      throw new NotFoundError('User not found');
    }

    const filter = { user: targetUserId };

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(query.limit, 10) || 10), 50);
    const start = (page - 1) * limit;

    const [items, total] = await Promise.all([
      SavedRecommendation.find(filter)
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .lean(),
      SavedRecommendation.countDocuments(filter),
    ]);

    return {
      history: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: start + limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async refreshRecommendations(user, type = 'programs') {
    if (type === 'programs') {
      const res = await this.getProgramRecommendations(user, { page: '1', limit: '12' });
      return res.recommendations;
    }

    if (type === 'volunteers') {
      const res = await this.getVolunteerRecommendations(user, { programId: '', page: '1', limit: '12' });
      return res.recommendations;
    }

    throw new ValidationError('Invalid recommendation type');
  }

  async submitFeedback(user, payload) {
    const { programId, volunteerId, rating, comments, dismissed } = payload;

    if (!programId && !volunteerId) {
      throw new ValidationError('Either programId or volunteerId is required');
    }

    const filter = { user: (user._id || user.id), isDeleted: false };
    if (programId) filter.program = programId;
    if (volunteerId) filter.volunteer = volunteerId;

    let saved = await SavedRecommendation.findOne(filter);
    if (!saved) {
      saved = await SavedRecommendation.create({
        user: (user._id || user.id),
        program: programId || null,
        volunteer: volunteerId || null,
        score: 0,
        metadata: { feedback: { rating, comments, dismissed, submittedAt: new Date() } },
      });
    } else {
      saved.metadata = {
        ...saved.metadata,
        feedback: { rating, comments, dismissed, submittedAt: new Date() },
      };
      await saved.save();
    }

    if (dismissed) {
      saved.isDeleted = true;
      saved.deletedAt = new Date();
      saved.deletedBy = (user._id || user.id);
      await saved.save();
    }

    const isProgram = !!programId;
    const title = isProgram ? 'Recommendation Feedback' : 'Volunteer Match Feedback';
    const message = isProgram
      ? `You rated a program recommendation ${rating}/5`
      : `You rated a volunteer match ${rating}/5`;

    await Notification.create({
      recipient: (user._id || user.id),
      sender: null,
      title,
      message,
      type: NOTIFICATION_TYPES.RECOMMENDATION_SAVED,
      category: 'recommendation',
      priority: PRIORITY.LOW,
      channel: 'in-app',
      relatedEntityType: isProgram ? 'program' : 'volunteer',
      relatedEntityId: isProgram ? programId : volunteerId,
      metadata: { rating, comments, dismissed },
    });

    return { success: true, feedback: { rating, comments, dismissed } };
  }

  async dismissRecommendation(user, payload) {
    const { programId, volunteerId } = payload;

    if (!programId && !volunteerId) {
      throw new ValidationError('Either programId or volunteerId is required');
    }

    const filter = { user: (user._id || user.id) };
    if (programId) filter.program = programId;
    if (volunteerId) filter.volunteer = volunteerId;

    let saved = await SavedRecommendation.findOne(filter);
    if (saved) {
      saved.isDeleted = true;
      saved.deletedAt = new Date();
      saved.deletedBy = (user._id || user.id);
      saved.metadata = {
        ...saved.metadata,
        dismissedAt: new Date(),
      };
      await saved.save();
    } else {
      saved = await SavedRecommendation.create({
        user: (user._id || user.id),
        program: programId || null,
        volunteer: volunteerId || null,
        score: payload.score || 0,
        reasonForRecommendation: payload.reasonForRecommendation || 'Dismissed',
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: (user._id || user.id),
        metadata: {
          dismissedAt: new Date(),
        },
      });
    }

    const isProgram = !!programId;
    const title = isProgram ? 'Recommendation Dismissed' : 'Volunteer Match Dismissed';
    const message = isProgram
      ? 'A program recommendation was dismissed from your list.'
      : 'A volunteer match was dismissed from your list.';

    await Notification.create({
      recipient: (user._id || user.id),
      sender: null,
      title,
      message,
      type: NOTIFICATION_TYPES.RECOMMENDATION_SAVED,
      category: 'recommendation',
      priority: PRIORITY.LOW,
      channel: 'in-app',
      relatedEntityType: isProgram ? 'program' : 'volunteer',
      relatedEntityId: isProgram ? programId : volunteerId,
    });

    return { success: true };
  }

  async sendRecommendationNotification(user, recommendation) {
    const isProgram = !!recommendation.programId;
    const title = isProgram ? 'New Program Recommendation' : 'New Volunteer Match';
    const message = isProgram
      ? `We found a ${recommendation.score}% match: ${recommendation.programTitle}`
      : `We found a volunteer match: ${recommendation.volunteerName}`;

    await Notification.create({
      recipient: (user._id || user.id),
      sender: null,
      title,
      message,
      type: NOTIFICATION_TYPES.RECOMMENDATION_READY,
      category: 'recommendation',
      priority: PRIORITY.MEDIUM,
      channel: 'in-app',
      relatedEntityType: isProgram ? 'program' : 'volunteer',
      relatedEntityId: isProgram ? recommendation.programId : recommendation.volunteerId,
      actionUrl: isProgram ? `/matching/programs?highlight=${recommendation.programId}` : `/matching/volunteers`,
      metadata: {
        score: recommendation.score,
        reasonForRecommendation: recommendation.reasonForRecommendation,
        matchingSkills: recommendation.matchingSkills,
      },
    });
  }

  async sendSavedRecommendationNotification(user, recommendation) {
    const isProgram = !!recommendation.programId;
    const title = isProgram ? 'Program Saved' : 'Volunteer Saved';
    const message = isProgram
      ? `You saved ${recommendation.programTitle} (${recommendation.score}% match)`
      : `You saved volunteer ${recommendation.volunteerName} (${recommendation.score}% match)`;

    await Notification.create({
      recipient: (user._id || user.id),
      sender: null,
      title,
      message,
      type: NOTIFICATION_TYPES.RECOMMENDATION_SAVED,
      category: 'recommendation',
      priority: PRIORITY.LOW,
      channel: 'in-app',
      relatedEntityType: isProgram ? 'program' : 'volunteer',
      relatedEntityId: isProgram ? recommendation.programId : recommendation.volunteerId,
      actionUrl: isProgram ? `/matching/programs?saved=true` : '/recommendations/saved',
      metadata: {
        score: recommendation.score,
      },
    });
  }

  _normalize(arr) {
    return (arr || [])
      .map((s) => (typeof s === 'string' ? s.toLowerCase().trim() : ''))
      .filter(Boolean);
  }

  _calculateMatchScore(volunteer, program, relatedPastProgramCount = 0, _includeMeta = false) {
    const volunteerSkills = this._normalize(volunteer.skills);
    const volunteerInterests = this._normalize(volunteer.interests);
    const volunteerLanguages = this._normalize(volunteer.languages);
    const volunteerAvailability = this._normalize(volunteer.availability);

    const programTags = this._normalize(program.tags);
    const programCategory = (program.category || '').toLowerCase().trim();
    const programText = [program.title || '', program.shortDescription || '', program.description || '']
      .join(' ')
      .toLowerCase();

    const matchedSkills = volunteerSkills.filter((skill) =>
      programTags.includes(skill) || programCategory.includes(skill) || skill.includes(programCategory)
    );
    const skillScore =
      volunteerSkills.length > 0
        ? (matchedSkills.length / volunteerSkills.length) * MATCHING_WEIGHTS.SKILLS
        : 0;

    const matchedInterests = volunteerInterests.filter((interest) =>
      programTags.includes(interest) || programCategory.includes(interest) || interest.includes(programCategory)
    );
    const interestScore =
      volunteerInterests.length > 0
        ? (matchedInterests.length / volunteerInterests.length) * MATCHING_WEIGHTS.INTERESTS
        : 0;

    const matchedLanguages = volunteerLanguages.filter(
      (lang) =>
        programTags.includes(lang) ||
        programCategory.includes(lang) ||
        lang.includes(programCategory) ||
        programText.includes(lang)
    );
    const languageScore =
      volunteerLanguages.length > 0
        ? (matchedLanguages.length / volunteerLanguages.length) * MATCHING_WEIGHTS.LANGUAGES
        : 0;

    const vCity = (volunteer.city || '').toLowerCase().trim();
    const vState = (volunteer.state || '').toLowerCase().trim();
    const pCity = (program.city || '').toLowerCase().trim();
    const pState = (program.state || '').toLowerCase().trim();

    let locationScore = 0;
    if (vCity && pCity && vCity === pCity) {
      locationScore += MATCHING_WEIGHTS.LOCATION / 2;
    }
    if (vState && pState && vState === pState) {
      locationScore += MATCHING_WEIGHTS.LOCATION / 2;
    }

    let availabilityScore = 0;
    if (volunteerAvailability.length > 0) {
      const hasFlexible = volunteerAvailability.some((a) => a === 'flexible');
      availabilityScore = hasFlexible ? MATCHING_WEIGHTS.AVAILABILITY : MATCHING_WEIGHTS.AVAILABILITY / 2;
    }

    let previousProgramScore = 0;
    if (relatedPastProgramCount > 0) {
      previousProgramScore = Math.min(MATCHING_WEIGHTS.PREVIOUS_PROGRAMS, 5 + relatedPastProgramCount * 5);
    } else {
      previousProgramScore = Math.min(
        (volunteer.hoursCompleted || 0) / 100 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 2) +
          (volunteer.certificatesEarned || 0) / 5 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 4) +
          (volunteer.programsCompleted || 0) / 10 * (MATCHING_WEIGHTS.PREVIOUS_PROGRAMS / 4),
        MATCHING_WEIGHTS.PREVIOUS_PROGRAMS
      );
    }

    const totalScore = Math.round(
      Math.min(
        skillScore +
          interestScore +
          languageScore +
          locationScore +
          availabilityScore +
          previousProgramScore,
        100
      )
    );

    const allVolunteerKeywords = [...new Set([...volunteerSkills, ...volunteerInterests])];
    const missingSkills = programTags.filter((tag) => !allVolunteerKeywords.some((kw) => kw.includes(tag) || tag.includes(kw)));

    const matchingSkillsList = [...new Set(matchedSkills)];

    const reasons = [];
    if (matchedSkills.length > 0) reasons.push(`Skills: ${matchedSkills.join(', ')}`);
    if (matchedInterests.length > 0) reasons.push(`Interests: ${matchedInterests.join(', ')}`);
    if (vCity && pCity && vCity === pCity) reasons.push(`Same city: ${vCity}`);
    if (vState && pState && vState === pState) reasons.push(`Same state: ${vState}`);
    if ((volunteer.hoursCompleted || 0) > 50) reasons.push('Experienced volunteer');
    if (relatedPastProgramCount > 0) reasons.push(`Related experience in ${relatedPastProgramCount} program(s)`);

    const reason = reasons.length > 0 ? reasons.join('; ') : 'General profile compatibility';

    const result = {
      score: totalScore,
      matchingSkills: matchingSkillsList,
      missingSkills,
      reasonForRecommendation: reason,
    };

    if (program._id) {
      result.programId = program._id;
      result.programTitle = program.title;
      result.programCity = program.city;
      result.programState = program.state;
      result.programTags = program.tags;
      result.programCategory = program.category;
    }

    if (volunteer._id) {
      result.volunteerId = volunteer._id;
      result.volunteerName = volunteer.name;
      result.volunteerCity = volunteer.city;
      result.volunteerState = volunteer.state;
      result.volunteerSkills = volunteer.skills;
    }

    return result;
  }
}

module.exports = new MatchingService();
