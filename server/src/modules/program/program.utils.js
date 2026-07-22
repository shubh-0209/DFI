const Program = require('./program.model');
const slugify = require('slugify');

async function generateProgramId() {
  const count = await Program.countDocuments({});
  const nextNumber = count + 1;
  return `PROG${nextNumber.toString().padStart(6, '0')}`;
}

async function generateProgramSlug(title) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let suffix = 0;

  while (await Program.findOne({ slug, isDeleted: false })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

module.exports = {
  generateProgramId,
  generateProgramSlug,
};
