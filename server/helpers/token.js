const jwt = require("jsonwebtoken");

const generateAccessToken = (data) =>
  jwt.sign(data, process.env.JWT_ACCESS_SECRET, { expiresIn: "30d" });

const generateRefreshToken = (data) =>
  jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const saveToken = async (userId, refreshToken) => {
  let userTokens = await Token.findOne({ user: userId });

  if (userTokens) {
    userTokens.push({ token: refreshToken });
  } else {
    userTokens = new Token({
      user: userId,
      tokens: [{ token: refreshToken }],
    });
  }

  await userTokens.save();
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  saveToken,
};
