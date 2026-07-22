const Permission = require('../../modules/permission/permission.model');

const DEFAULT_PERMISSIONS = [
  { module: 'users', action: 'create', code: 'users:create', category: 'crud' },
  { module: 'users', action: 'read', code: 'users:read', category: 'crud' },
  { module: 'users', action: 'update', code: 'users:update', category: 'crud' },
  { module: 'users', action: 'delete', code: 'users:delete', category: 'crud' },
  { module: 'programs', action: 'create', code: 'programs:create', category: 'crud' },
  { module: 'programs', action: 'read', code: 'programs:read', category: 'crud' },
  { module: 'programs', action: 'update', code: 'programs:update', category: 'crud' },
  { module: 'programs', action: 'delete', code: 'programs:delete', category: 'crud' },
  { module: 'programs', action: 'publish', code: 'programs:publish', category: 'management' },
  { module: 'programs', action: 'archive', code: 'programs:archive', category: 'management' },
  { module: 'applications', action: 'create', code: 'applications:create', category: 'crud' },
  { module: 'applications', action: 'read', code: 'applications:read', category: 'crud' },
  { module: 'applications', action: 'update', code: 'applications:update', category: 'crud' },
  { module: 'applications', action: 'delete', code: 'applications:delete', category: 'crud' },
  { module: 'applications', action: 'approve', code: 'applications:approve', category: 'management' },
  { module: 'attendance', action: 'mark', code: 'attendance:mark', category: 'crud' },
  { module: 'attendance', action: 'read', code: 'attendance:read', category: 'crud' },
  { module: 'certificates', action: 'create', code: 'certificates:create', category: 'crud' },
  { module: 'certificates', action: 'read', code: 'certificates:read', category: 'crud' },
  { module: 'certificates', action: 'generate', code: 'certificates:generate', category: 'management' },
  { module: 'rewards', action: 'create', code: 'rewards:create', category: 'crud' },
  { module: 'rewards', action: 'read', code: 'rewards:read', category: 'crud' },
  { module: 'rewards', action: 'update', code: 'rewards:update', category: 'crud' },
  { module: 'rewards', action: 'delete', code: 'rewards:delete', category: 'crud' },
  { module: 'leaderboard', action: 'read', code: 'leaderboard:read', category: 'read' },
  { module: 'leaderboard', action: 'refresh', code: 'leaderboard:refresh', category: 'management' },
  { module: 'notifications', action: 'create', code: 'notifications:create', category: 'crud' },
  { module: 'notifications', action: 'read', code: 'notifications:read', category: 'crud' },
  { module: 'notifications', action: 'update', code: 'notifications:update', category: 'crud' },
  { module: 'notifications', action: 'delete', code: 'notifications:delete', category: 'crud' },
  { module: 'organizations', action: 'create', code: 'organizations:create', category: 'admin' },
  { module: 'organizations', action: 'read', code: 'organizations:read', category: 'admin' },
  { module: 'organizations', action: 'update', code: 'organizations:update', category: 'admin' },
  { module: 'organizations', action: 'delete', code: 'organizations:delete', category: 'admin' },
  { module: 'roles', action: 'create', code: 'roles:create', category: 'admin' },
  { module: 'roles', action: 'read', code: 'roles:read', category: 'admin' },
  { module: 'roles', action: 'update', code: 'roles:update', category: 'admin' },
  { module: 'roles', action: 'delete', code: 'roles:delete', category: 'admin' },
  { module: 'permissions', action: 'read', code: 'permissions:read', category: 'admin' },
  { module: 'analytics', action: 'read', code: 'analytics:read', category: 'admin' },
  { module: 'media', action: 'upload', code: 'media:upload', category: 'management' },
  { module: 'settings', action: 'read', code: 'settings:read', category: 'admin' },
  { module: 'settings', action: 'update', code: 'settings:update', category: 'admin' },
];

const seedPermissions = async () => {
  try {
    const existingCount = await Permission.countDocuments({ isSystemPermission: true });
    if (existingCount > 0) {
      // eslint-disable-next-line no-console
      console.log('Permissions already exist');
      return { inserted: 0, skipped: existingCount };
    }

    let inserted = 0;
    let skipped = 0;

    for (const [idx, perm] of DEFAULT_PERMISSIONS.entries()) {
      try {
        await Permission.create({
          permissionId: `PERM${String(idx + 1).padStart(4, '0')}`,
          ...perm,
          isSystemPermission: true,
        });
        inserted++;
      } catch (err) {
        if (err.code === 11000) {
          skipped++;
        } else {
          throw err;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(`Permissions Seeded: ${inserted} inserted, ${skipped} skipped`);
    return { inserted, skipped };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Permission seeding failed:', error.message);
    return { inserted: 0, skipped: 0, error: error.message };
  }
};

module.exports = { seedPermissions, DEFAULT_PERMISSIONS };