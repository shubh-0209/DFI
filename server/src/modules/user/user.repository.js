const User = require('./user.model');

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByUsername(username) {
    return User.findOne({ username });
  }

  async findByVolunteerId(volunteerId) {
    return User.findOne({ volunteerId });
  }

  async updateProfile(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateProfilePhoto(id, photoUrl) {
    return User.findByIdAndUpdate(
      id,
      { profilePhoto: photoUrl },
      { new: true, runValidators: true }
    );
  }

  async updateResume(id, resumeUrl) {
    return User.findByIdAndUpdate(id, { resume: resumeUrl }, { new: true, runValidators: true });
  }

  async updateProfileProgress(id, profileCompletion, profileStrength, volunteerLevel) {
    return User.findByIdAndUpdate(
      id,
      { profileCompletion, profileStrength, volunteerLevel },
      { new: true }
    );
  }

  async getVolunteerStatistics(id) {
    return User.findById(id).select(
      'points hoursCompleted programsJoined programsCompleted certificatesEarned referralCount impactScore volunteerLevel profileCompletion profileStrength'
    );
  }

  async searchUsers(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return { users, total };
  }

  async findPublicProfile(username) {
    return User.findOne({ username }).select(
      'name username profilePhoto about college course city state skills points hoursCompleted programsCompleted volunteerLevel profileCompletion profileStrength impactScore'
    );
  }

  async findVolunteersForLeaderboard(skip = 0, limit = 20) {
    const supabase = require('../../config/supabase');
    const { data, error } = await supabase
      .from('users')
      .select('document')
      .filter('document->>role', 'eq', 'volunteer')
      .filter('document->>status', 'eq', 'active')
      .filter('document->>isDeleted', 'eq', 'false')
      .order('document->>points', { ascending: false })
      .range(skip, skip + limit - 1);
    
    if (error) {
      console.error('[UserRepository] Supabase error fetching volunteers for leaderboard:', error);
      return [];
    }
    
    return data.map(row => {
      const doc = row.document;
      return { _id: doc._id, ...doc };
    });
  }

  async getVolunteerRank() {
    return null;
  }

  async countVolunteersForLeaderboard() {
    const supabase = require('../../config/supabase');
    const { count, error } = await supabase
      .from('users')
      .select('document', { count: 'exact', head: true })
      .filter('document->>role', 'eq', 'volunteer')
      .filter('document->>status', 'eq', 'active')
      .filter('document->>isDeleted', 'eq', 'false');
    
    if (error) {
      console.error('[UserRepository] Supabase error counting volunteers:', error);
      return 0;
    }
    return count || 0;
  }

  async findTopVolunteers(limit = 10) {
    const supabase = require('../../config/supabase');
    const { data, error } = await supabase
      .from('users')
      .select('document')
      .filter('document->>role', 'eq', 'volunteer')
      .filter('document->>status', 'eq', 'active')
      .filter('document->>isDeleted', 'eq', 'false')
      .order('document->>points', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('[UserRepository] Supabase error fetching top volunteers:', error);
      return [];
    }
    
    return data.map(row => {
      const doc = row.document;
      return { _id: doc._id, ...doc };
    });
  }

  async countDocuments(query = {}) {
    return User.countDocuments(query);
  }
}

module.exports = new UserRepository();
