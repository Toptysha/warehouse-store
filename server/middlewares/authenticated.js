const {
  setTokensInDbAndCookie,
  checkTimeToEndAccessToken,
} = require("../helpers/token");

module.exports = async function (req, res, next) {
  try {
    if (req.cookies.accessToken) {
      const user = await checkTimeToEndAccessToken(req, res);

      req.user = user;
      next();
    } else {
      const user = await setTokensInDbAndCookie(req, res);

      req.user = user;
      next();
    }
  } catch (error) {
    res.send({ error: "Пользователь не авторизован" });
  }
};
