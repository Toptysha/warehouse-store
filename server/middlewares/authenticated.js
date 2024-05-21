const User = require("../models/User");
const { verifyToken } = require("../helpers/token");

module.exports = async function (req, res, next) {
  const tokenData = verifyToken(req.cookies.token);

  const user = await User.findOne({ _id: tokenData.id });

  if (!user) {
    res.send({ error: "User not found" });
    return;
  }

  req.user = user;
  next();
};
