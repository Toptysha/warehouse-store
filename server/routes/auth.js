const express = require("express");
const {
  register,
  login,
  checkAuth,
  editUser,
  findUserByToken,
} = require("../controllers/user");
const mapUser = require("../helpers/mapUser");
const {
  refreshAccessToken,
  setTokensInDbAndCookie,
  verifyAccessToken,
  checkTimeToEndAccessToken,
} = require("../helpers/token");
const TOKENS_LIFE = require("../constants/tokens-time-life");
const MAIN_DATA = require("../prod-dev-data");

const router = express.Router({ mergeParams: true });

router.post("/register", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await register(
      req.body.login,
      req.body.phone,
      req.body.password
    );

    res
      .cookie("accessToken", accessToken, MAIN_DATA.ACCESS_TOKEN_PARAMS)
      .cookie("refreshToken", refreshToken, MAIN_DATA.REFRESH_TOKEN_PARAMS)
      .send({ error: null, data: mapUser(user) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await login(
      req.body.phone,
      req.body.password
    );

    res
      .cookie("accessToken", accessToken, MAIN_DATA.ACCESS_TOKEN_PARAMS)
      .cookie("refreshToken", refreshToken, MAIN_DATA.REFRESH_TOKEN_PARAMS)
      .send({ error: null, data: mapUser(user) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.post("/logout", async (req, res) => {
  const user = await findUserByToken(req.cookies.refreshToken);
  await editUser(user.id, { token: null });
  res.clearCookie("accessToken").clearCookie("refreshToken").send({});
});

router.get("/me", async (req, res) => {
  try {
    if (req.cookies.accessToken) {
      const user = await checkTimeToEndAccessToken(req, res);
      res.send({ data: mapUser(user) });
    } else {
      const user = await setTokensInDbAndCookie(req, res);
      res.send({ data: mapUser(user) });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = router;
