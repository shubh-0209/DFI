const permissionRepository = require('./permission.repository');
const Permission = require('./permission.model');
const { MESSAGES } = require('./permission.constants');
const { DEFAULT_PERMISSIONS } = require('../../database/seeders/permission.seeder');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');

class PermissionService {
  async createPermission(permissionData) {
    const { code, module, action, description, category } = permissionData;

    const existing = await permissionRepository.existsByCode(code);
    if (existing) {
      throw new ConflictError(MESSAGES.PERMISSION_ALREADY_EXISTS);
    }

    const count = await Permission.countDocuments({});
    const permission = await permissionRepository.create({
      permissionId: `PERM${String(count + 1).padStart(4, '0')}`,
      module,
      action,
      code,
      description,
      category,
      isSystemPermission: false,
    });

    return { permission };
  }

  async getPermissions(queryParams) {
    const { permissions, total, page, limit } =
      await permissionRepository.findAll(queryParams);
    const totalPages = Math.ceil(total / limit);
    return {
      permissions,
      pagination: { total, page, limit, totalPages },
    };
  }

  async findAll() {
    return Permission.find({});
  }

  async seedDefaultPermissions() {
    const count = await Permission.countDocuments({ isSystemPermission: true });
    if (count > 0) {
      return { message: 'Default permissions already seeded' };
    }

    const permissionsToCreate = DEFAULT_PERMISSIONS.map((p, idx) => ({
      ...p,
      permissionId: `PERM${String(idx + 1).padStart(4, '0')}`,
      isSystemPermission: true,
    }));

    await Permission.insertMany(permissionsToCreate);
    return { message: `${permissionsToCreate.length} default permissions seeded` };
  }

  async findByCode(code) {
    const permission = await permissionRepository.findByCode(code);
    if (!permission) {
      throw new ValidationError(MESSAGES.PERMISSION_NOT_FOUND);
    }
    return { permission };
  }
}

module.exports = new PermissionService();