const LEADERBOARD_TYPE = {
  CITY: 'city',
  STATE: 'state',
  NATIONAL: 'national',
};

const MESSAGES = {
  LEADERBOARD_FETCHED: 'Leaderboard retrieved successfully',
  MY_RANK_FETCHED: 'Your rank retrieved successfully',
  TOP_VOLUNTEERS_FETCHED: 'Top volunteers retrieved successfully',
  LEADERBOARD_REFRESHED: 'Leaderboard refreshed successfully',
  LEADERBOARD_NOT_FOUND: 'Leaderboard entry not found',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};

const VALIDATION = {
  LEADERBOARD_ID_PREFIX: 'LB',
  MIN_RANK: 1,
  DEFAULT_TOP_LIMIT: 10,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

module.exports = {
  LEADERBOARD_TYPE,
  MESSAGES,
  PAGINATION,
  VALIDATION,
};
