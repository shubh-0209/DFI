const Organization = require('../../modules/organization/organization.model');
const User = require('../../modules/user/user.model');
const { VERIFICATION_STATUS } = require('../../modules/organization/organization.constants');
const ROLES = require('../../constants/roles.constants');

const seedOrganization = async () => {
  try {
    const existing = await Organization.findOne({ slug: 'disha', isDeleted: false });
    if (existing) {
      // eslint-disable-next-line no-console
      console.log('Organization already exists');
      return { inserted: 0, skipped: 1 };
    }

    let superAdmin = await User.findOne({ role: ROLES.SUPER_ADMIN });
    if (!superAdmin) {
      superAdmin = await User.findOne({ email: 'admin@dishaforindia.org' });
      if (superAdmin) {
        superAdmin.role = ROLES.SUPER_ADMIN;
        if (superAdmin.password && !superAdmin.password.startsWith('$2b$')) {
          superAdmin.password = await require('bcrypt').hash('changeme123', 10);
        }
        await superAdmin.save();
      } else {
        const hashedPassword = await require('bcrypt').hash('changeme123', 10);
        superAdmin = await User.create({
          name: 'Super Admin',
          username: 'superadmin',
          email: 'admin@dishaforindia.org',
          password: hashedPassword,
          role: ROLES.SUPER_ADMIN,
          status: 'active',
          permissions: [],
        });
      }
    } else {
      if (superAdmin.password && !superAdmin.password.startsWith('$2b$')) {
        superAdmin.password = await require('bcrypt').hash('changeme123', 10);
        await superAdmin.save();
      }
    }

    await Organization.create({
      organizationId: 'ORG000001',
      name: 'Disha',
      slug: 'disha',
      shortName: 'Disha',
      description: 'Disha for India - Volunteer Management Platform',
      email: 'contact@dishaforindia.org',
      phone: '+919876543210',
      website: 'https://dishaforindia.org',
      address: 'New Delhi, India',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      foundedYear: 2023,
      organizationType: 'ngo',
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      isActive: true,
      owner: superAdmin._id,
      admins: [superAdmin._id],
      createdBy: superAdmin._id,
      updatedBy: superAdmin._id,
    });

    // eslint-disable-next-line no-console
    console.log('Organization Seeded');
    return { inserted: 1, skipped: 0 };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Organization seeding failed:', error.message);
    return { inserted: 0, skipped: 0, error: error.message };
  }
};

module.exports = { seedOrganization };