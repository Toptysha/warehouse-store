const TOKENS_LIFE = {
  ACCESS: 60 * 60 * 1000, // 60 minutes
  REFRESH: 60 * 24 * 60 * 60 * 1000, // 60 days
  ACCESS_FOR_GENERATE: "60m",
  REFRESH_FOR_GENERATE: "60d",
  FORCE_UPDATE: 30 * 60, // 30 minutes
};

module.exports = TOKENS_LIFE;
