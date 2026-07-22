const TRANSACTION_TYPE = {
  EARNED: 'earned',
  REDEEMED: 'redeemed',
  ADJUSTED: 'adjusted',
  EXPIRED: 'expired',
};

const MESSAGES = {
  TRANSACTION_CREATED: 'Reward transaction created successfully',
  TRANSACTION_FETCHED: 'Reward transaction retrieved successfully',
  TRANSACTIONS_FETCHED: 'Reward transactions retrieved successfully',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = {
  TRANSACTION_TYPE,
  MESSAGES,
  PAGINATION,
};
