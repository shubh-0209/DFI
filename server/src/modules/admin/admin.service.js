const adminRepository = require('./admin.repository');
const attendanceRepository = require('../attendance/attendance.repository');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('./admin.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const { AuthorizationError } = require('../../utils/errors');
const { ConflictError } = require('../../utils/errors');

class AdminService {
  /**
   * Build Mongoose filter object from query params.
   * @param {object} params - Query parameters.
   * @returns {object} Mongoose filter.
   */
  _buildFilters({ search, role, status, city, state, showDeleted }) {
    const filters = {};

    // By default, exclude soft-deleted users unless explicitly requested
    if (showDeleted === 'true') {
      filters.isDeleted = true;
    } else {
      filters.isDeleted = false;
    }

    if (role) filters.role = role;
    if (status) filters.status = status;
    if (city) filters.city = { $regex: city, $options: 'i' };
    if (state) filters.state = { $regex: state, $options: 'i' };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { volunteerId: { $regex: search, $options: 'i' } },
      ];
    }

    return filters;
  }

  /**
   * Get all users with filters, search, pagination, and sorting.
   * @param {object} queryParams - Request query parameters.
   * @returns {Promise<object>} Paginated users with metadata.
   */
  async getAllUsers(queryParams) {
    const {
      page = DEFAULT_PAGE,
      limit = DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      role,
      status,
      city,
      state,
      showDeleted,
    } = queryParams;

    const safeLimit = Math.min(Number(limit), MAX_LIMIT);
    const safePage = Math.max(Number(page), 1);

    const filters = this._buildFilters({ search, role, status, city, state, showDeleted });
    const options = { page: safePage, limit: safeLimit, sortBy, sortOrder };

    const { users, total } = await adminRepository.findAllUsers(filters, options);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      users,
      pagination: {
        total,
        totalPages,
        currentPage: safePage,
        limit: safeLimit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    };
  }

  /**
   * Get a single user's full details by ID.
   * @param {string} userId - Target user ID.
   * @returns {Promise<object>} User data.
   */
  async getUserDetails(userId) {
    const user = await adminRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return { user };
  }

  /**
   * Change user account status.
   * @param {string} targetId - Target user ID.
   * @param {string} adminId - Admin performing the action.
   * @param {string} status - New status.
   * @returns {Promise<object>} Updated user.
   */
  async changeUserStatus(targetId, adminId, status) {
    // Prevent admin from blocking themselves
    if (targetId === adminId.toString()) {
      throw new AuthorizationError('You cannot change your own account status');
    }

    const user = await adminRepository.findUserById(targetId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isDeleted) {
      throw new ConflictError('Cannot update status of a deleted user. Restore the user first.');
    }

    const updated = await adminRepository.updateUserStatus(targetId, status);
    return { user: updated };
  }

  /**
   * Change user role.
   * @param {string} targetId - Target user ID.
   * @param {string} adminId - Admin performing the action.
   * @param {string} role - New role.
   * @returns {Promise<object>} Updated user.
   */
  async changeUserRole(targetId, adminId, role) {
    const user = await adminRepository.findUserById(targetId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isDeleted) {
      throw new ConflictError('Cannot update role of a deleted user. Restore the user first.');
    }

    // Prevent removing the last admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await adminRepository.countAdmins();
      if (adminCount <= 1) {
        throw new ConflictError(
          'Cannot demote this user. There must be at least one admin account.'
        );
      }
    }

    const updated = await adminRepository.updateUserRole(targetId, role);
    return { user: updated };
  }

  /**
   * Soft delete a user.
   * @param {string} targetId - Target user ID.
   * @param {string} adminId - Admin performing the deletion.
   * @returns {Promise<object>} Deleted user.
   */
  async deleteUser(targetId, adminId) {
    // Prevent admin from deleting themselves
    if (targetId === adminId.toString()) {
      throw new AuthorizationError('You cannot delete your own account');
    }

    const user = await adminRepository.findUserById(targetId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isDeleted) {
      throw new ConflictError('User is already deleted');
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await adminRepository.countAdmins();
      if (adminCount <= 1) {
        throw new ConflictError('Cannot delete the last admin account');
      }
    }

    const deleted = await adminRepository.softDeleteUser(targetId, adminId);
    return { user: deleted };
  }

  /**
   * Restore a soft-deleted user.
   * @param {string} targetId - Target user ID.
   * @returns {Promise<object>} Restored user.
   */
  async restoreUser(targetId) {
    const user = await adminRepository.findUserById(targetId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isDeleted) {
      throw new ConflictError('User is not deleted and does not need to be restored');
    }

    const restored = await adminRepository.restoreUser(targetId);
    return { user: restored };
  }

  /**
   * Get admin dashboard statistics.
   * @returns {Promise<object>} Dashboard statistics.
   */
  async getDashboardStatistics() {
    const stats = await adminRepository.getUserStatistics();
    try {
      const attendanceStats = await attendanceRepository.getAttendanceStatistics();
      stats.totalHoursLogged = attendanceStats.totalVolunteerHours || 0;
    } catch (_error) {
      stats.totalHoursLogged = 0;
    }
    return stats;
  }
}

module.exports = new AdminService();
