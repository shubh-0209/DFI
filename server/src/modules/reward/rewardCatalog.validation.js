const validateGetCatalog = (req, res, next) => next();
const validateGetRewardDetail = (req, res, next) => next();
const validateRedeemReward = (req, res, next) => next();
const validateCreateReward = (req, res, next) => {
  const { name, category, coinCost, stock } = req.body;
  if (!name || !category || coinCost == null || stock == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  return next();
};

module.exports = {
  validateGetCatalog,
  validateGetRewardDetail,
  validateRedeemReward,
  validateCreateReward,
};
