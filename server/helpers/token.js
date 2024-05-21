const jwt = require("jsonwebtoken");

const generateToken = (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { generateToken, verifyToken };
