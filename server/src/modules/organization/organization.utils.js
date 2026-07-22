const Organization = require('./organization.model');
const slugify = require('slugify');

async function generateOrganizationId() {
  const count = await Organization.countDocuments({});
  const nextNumber = count + 1;
  return `ORG${nextNumber.toString().padStart(6, '0')}`;
}

async function generateOrganizationSlug(name) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let suffix = 0;

  while (await Organization.findOne({ slug, isDeleted: false })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

module.exports = {
  generateOrganizationId,
  generateOrganizationSlug,
};
