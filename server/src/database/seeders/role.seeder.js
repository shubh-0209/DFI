const Role = require('../../modules/role/role.model');
const Permission = require('../../modules/permission/permission.model');
const { ROLE_PERMISSIONS } = require('../../modules/role/role.constants');

const seedRoles = async () => {
  try {
    const existingCount = await Role.countDocuments({ isSystemRole: true });
    if (existingCount > 0) {
      // eslint-disable-next-line no-console
      console.log('Roles already exist');
      return { inserted: 0, updated: 0 };
    }

    const permissions = await Permission.find({ isSystemPermission: true });
    const permissionMap = {};
    permissions.forEach((p) => (permissionMap[p.code] = p._id));

    let inserted = 0;

    for (const [idx, [slug, codes]] of Object.entries(Object.entries(ROLE_PERMISSIONS)).entries()) {
      try {
        await Role.create({
          roleId: `ROLE${String(idx + 1).padStart(4, '0')}`,
          name: slug.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          slug,
          description: `System role: ${slug}`,
          organization: null,
          permissions: codes.map((code) => permissionMap[code]).filter(Boolean),
          isSystemRole: true,
          createdBy: null,
          updatedBy: null,
        });
        inserted++;
      } catch (err) {
        if (err.code !== 11000) {
          throw err;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Roles Seeded: ${inserted} inserted`);
    return { inserted, updated: 0 };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Role seeding failed:', error.message);
    return { inserted: 0, updated: 0, error: error.message };
  }
};

module.exports = { seedRoles, ROLE_PERMISSIONS };