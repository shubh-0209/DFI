const User = require('../user/user.model');

class AdminRepository {
  /**
   * Find all users with filters, search, pagination, and sorting.
   * @param {object} filters - MongoDB query filters.
   * @param {object} options - Pagination and sorting options.
   * @returns {Promise<object>} { users, total }
   */
  async findAllUsers(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(filters).sort(sort).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filters),
    ]);

    return { users, total };
  }

  /**
   * Find user by ID (includes soft-deleted users for admin view).
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} The user document.
   */
  async findUserById(id) {
    return User.findById(id);
  }

  /**
   * Update user status.
   * @param {string} id - User ID.
   * @param {string} status - New status.
   * @returns {Promise<User|null>} Updated user.
   */
  async updateUserStatus(id, status) {
    return User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }

  /**
   * Update user role.
   * @param {string} id - User ID.
   * @param {string} role - New role.
   * @returns {Promise<User|null>} Updated user.
   */
  async updateUserRole(id, role) {
    return User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  }

  /**
   * Soft delete a user.
   * @param {string} id - User ID.
   * @param {string} deletedById - Admin user ID performing the deletion.
   * @returns {Promise<User|null>} Updated user.
   */
  async softDeleteUser(id, deletedById) {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
        status: 'inactive',
      },
      { new: true }
    );
  }

  /**
   * Restore a soft-deleted user.
   * @param {string} id - User ID.
   * @returns {Promise<User|null>} Updated user.
   */
  async restoreUser(id) {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        status: 'active',
      },
      { new: true }
    );
  }

  /**
   * Count users by role.
   * @param {string} role - Role name.
   * @returns {Promise<number>} Count.
   */
  async countByRole(role) {
    return User.countDocuments({ role, isDeleted: false });
  }

  /**
   * Count users by status.
   * @param {string} status - Status value.
   * @returns {Promise<number>} Count.
   */
  async countByStatus(status) {
    return User.countDocuments({ status, isDeleted: false });
  }

  /**
   * Count users registered this month.
   * @returns {Promise<number>} Count.
   */
  async countNewThisMonth() {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return User.countDocuments({ createdAt: { $gte: start }, isDeleted: false });
  }

  /**
   * Count all admins (for last-admin protection).
   * @returns {Promise<number>} Admin count.
   */
  async countAdmins() {
    return User.countDocuments({ role: 'admin', isDeleted: false });
  }

  /**
   * Aggregate dashboard statistics.
   * @returns {Promise<object>} Statistics object.
   */
  async getUserStatistics() {
    const [
      totalUsers,
      totalVolunteers,
      totalAdmins,
      totalCoordinators,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      deletedUsers,
      newThisMonth,
    ] = await Promise.all([
      User.countDocuments({ isDeleted: false }),
      this.countByRole('volunteer'),
      this.countByRole('admin'),
      this.countByRole('coordinator'),
      this.countByStatus('active'),
      this.countByStatus('inactive'),
      this.countByStatus('suspended'),
      User.countDocuments({ isDeleted: true }),
      this.countNewThisMonth(),
    ]);

    return {
      totalUsers,
      totalVolunteers,
      totalAdmins,
      totalCoordinators,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      deletedUsers,
      newThisMonth,
    };
  }
}

module.exports = new AdminRepository();
