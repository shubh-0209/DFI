const Application = require('./application.model');

async function generateApplicationId() {
  const count = await Application.countDocuments({});
  const nextNumber = count + 1;
  return `APP${nextNumber.toString().padStart(6, '0')}`;
}

module.exports = {
  generateApplicationId,
};
