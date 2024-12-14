require("dotenv").config();
const TOKENS_LIFE = require("./constants/tokens-time-life");

// PROD-DATA
const RESERVED_DATA = {
  ACCESS_TOKEN_PARAMS: {
    maxAge: TOKENS_LIFE.ACCESS,
    httpOnly: true,
    domain: ".warehouse-store.online",
    secure: true, // при использовании https
  },
  REFRESH_TOKEN_PARAMS: {
    maxAge: TOKENS_LIFE.REFRESH,
    httpOnly: true,
    domain: ".warehouse-store.online",
    secure: true,
  },
};

// DEV-DATA
const MAIN_DATA = {
  ACCESS_TOKEN_PARAMS: {
    maxAge: TOKENS_LIFE.ACCESS,
    httpOnly: true,
  },
  REFRESH_TOKEN_PARAMS: {
    maxAge: TOKENS_LIFE.REFRESH,
    httpOnly: true,
  },
};

module.exports = MAIN_DATA;
