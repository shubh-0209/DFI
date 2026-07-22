const userRepository = require('./user.repository');
const { calculateProfileCompletion } = require('./profileCompletion.util');
const { calculateProfileStrength } = require('./profileStrength.util');
const { calculateVolunteerLevel, getVolunteerLevelBrackets } = require('./volunteerLevel.util');
const NotFoundError = require('../../utils/errors/NotFoundError');
const { ConflictError } = require('../../utils/errors');
const notificationService = require('../notification/notification.service');
const supabase = require('../../config/supabase');

class UserService {
  /**
   * Get current user's profile.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} The user profile data.
   */
  async getCurrentProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return { user };
  }

  /**
   * Update user profile with mass-assignment protection,
   * username uniqueness check, and automatic progress recalculation.
   * @param {string} userId - User ID.
   * @param {object} updateData - Data to update.
   * @returns {Promise<object>} The updated user profile.
   */
  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Allowed fields only — prevent mass assignment
    const ALLOWED_FIELDS = [
      'name',
      'username',
      'phone',
      'gender',
      'dateOfBirth',
      'college',
      'course',
      'graduationYear',
      'educationLevel',
      'city',
      'state',
      'country',
      'about',
      'skills',
      'languages',
      'interests',
      'availability',
      'linkedin',
      'portfolio',
      'notificationPreferences',
      'privacySettings',
      'appearance',
    ];

    const allowedData = {};
    for (const key of ALLOWED_FIELDS) {
      if (updateData[key] !== undefined) {
        allowedData[key] = updateData[key];
      }
    }

    // Username uniqueness check
    if (allowedData.username && allowedData.username !== user.username) {
      const existingUser = await userRepository.findByUsername(allowedData.username);
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new ConflictError('Username is already taken');
      }
    }

    // Merge changes
    Object.assign(user, allowedData);

    // Recalculate and persist all progress fields
    const previousCompletion = user.profileCompletion || 0;
    const completion = calculateProfileCompletion(user);
    const strength = calculateProfileStrength(completion);
    const level = calculateVolunteerLevel(user.points);

    user.profileCompletion = completion;
    user.profileStrength = strength;
    user.volunteerLevel = level;

    await user.save();

    if (completion === 100 && previousCompletion < 100) {
      try {
        await notificationService.sendInAppNotification('buildProfileCompleted', {
          recipientId: user._id.toString(),
          completionPercentage: completion,
        });
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    return { user };
  }

  /**
   * Upload user profile photo using Supabase Storage.
   * @param {string} userId - User ID.
   * @param {object} file - File upload object (multer memory storage).
   * @returns {Promise<object>} The updated user with new profile photo URL.
   */
  async uploadProfilePhoto(userId, file) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!file) {
      throw new Error('No file provided');
    }

    const bucketName = 'avatars';
    
    // 1. Ensure bucket exists (create if not, ignore if already exists)
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets || !buckets.find((b) => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    // 2. Prepare upload path and perform upload
    const fileExt = file.originalname.split('.').pop() || 'png';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // 4. Save to user profile
    user.profilePhoto = publicUrlData.publicUrl;
    await user.save();

    return { user };
  }

  /**
   * Upload user resume.
   * @param {string} userId - User ID.
   * @param {object} file - File upload object.
   * @returns {Promise<object>} SKELETON — implemented in Module 3.4.
   */
  async uploadResume(userId, file) {
    return { userId, file };
  }

  /**
   * Get public profile of a user by username.
   * @param {string} username - User username.
   * @returns {Promise<object>} The public user profile.
   */
  async getPublicProfile(username) {
    const user = await userRepository.findPublicProfile(username);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return { user };
  }

  /**
   * Search/list users for admin.
   * @param {object} query - Search queries.
   * @param {object} options - Pagination/sorting options.
   * @returns {Promise<object>} SKELETON — implemented in a later module.
   */
  async searchUsers(query, options) {
    return { query, options };
  }

  /**
   * Get the profile completion details for the current user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Completion data object.
   */
  async getProfileCompletion(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Recalculate live (do not persist — this is a read endpoint)
    const completion = calculateProfileCompletion(user);
    const strength = calculateProfileStrength(completion);
    const level = calculateVolunteerLevel(user.points);

    const completionBreakdown = {
      name: !!(user.name && user.name.trim()),
      phone: !!(user.phone && user.phone.trim()),
      about: !!(user.about && user.about.trim()),
      city: !!(user.city && user.city.trim()),
      college: !!(user.college && user.college.trim()),
      course: !!(user.course && user.course.trim()),
      skills: user.skills && user.skills.length > 0,
      languages: user.languages && user.languages.length > 0,
      interests: user.interests && user.interests.length > 0,
      availability: user.availability && user.availability.length > 0,
      linkedin: !!(user.linkedin && user.linkedin.trim()),
      portfolio: !!(user.portfolio && user.portfolio.trim()),
      profilePhoto: !!(user.profilePhoto && user.profilePhoto.trim()),
      resume: !!(user.resume && user.resume.trim()),
    };

    return {
      profileCompletion: completion,
      profileStrength: strength,
      volunteerLevel: level,
      breakdown: completionBreakdown,
    };
  }

  /**
   * Get volunteer statistics for the current user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Volunteer statistics object.
   */
  async getVolunteerStatistics(userId) {
    const user = await userRepository.getVolunteerStatistics(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const level = calculateVolunteerLevel(user.points);
    const levelBrackets = getVolunteerLevelBrackets();

    // Determine next level and points gap
    const currentLevelIndex = levelBrackets.findIndex((b) => b.level === level);
    const nextLevel = currentLevelIndex > 0 ? levelBrackets[currentLevelIndex - 1] : null;
    const pointsToNextLevel = nextLevel ? nextLevel.minPoints - user.points : 0;

    return {
      points: user.points,
      hoursCompleted: user.hoursCompleted,
      programsJoined: user.programsJoined,
      programsCompleted: user.programsCompleted,
      certificatesEarned: user.certificatesEarned,
      referralCount: user.referralCount,
      impactScore: user.impactScore,
      volunteerLevel: level,
      profileCompletion: user.profileCompletion,
      profileStrength: user.profileStrength,
      nextLevel: nextLevel ? nextLevel.level : null,
      pointsToNextLevel: Math.max(pointsToNextLevel, 0),
    };
  }

  /**
   * Calculate profile completion score.
   * @param {object} user - User document.
   * @returns {number} Completion percentage.
   */
  calculateProfileCompletion(user) {
    return calculateProfileCompletion(user);
  }

  /**
   * Calculate profile strength label.
   * @param {number} completionPercent - Profile completion percentage.
   * @returns {string} Strength label.
   */
  calculateProfileStrength(completionPercent) {
    return calculateProfileStrength(completionPercent);
  }

  /**
   * Calculate volunteer level based on points.
   * @param {number} points - Total volunteer points.
   * @returns {string} Level label.
   */
  calculateVolunteerLevel(points) {
    return calculateVolunteerLevel(points);
  }
}

module.exports = new UserService();
