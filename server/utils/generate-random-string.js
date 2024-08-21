const crypto = require("crypto");

function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

module.exports = {
  generateRandomString,
};
