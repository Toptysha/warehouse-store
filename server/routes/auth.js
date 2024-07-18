const express = require("express");
const { register, login, checkAuth, getUserFromPG} = require("../controllers/user");
const mapUser = require("../helpers/mapUser");

const router = express.Router({ mergeParams: true });

router.post("/register", async (req, res) => {
  try {
    const { user, token } = await register(
      req.body.login,
      req.body.phone,
      req.body.password
    );

    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, data: mapUser(user) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, token } = await login(req.body.phone, req.body.password);
    res
      .cookie("token", token, { httpOnly: true })
      .send({ error: null, data: mapUser(user) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", "", { httpOnly: true }).send({});
});

router.get("/me", async (req, res) => {
  try {
    const user = await checkAuth(req.cookies.token);
    res.send({ data: mapUser(user) });
  } catch (err) {
    res.send({ error: err.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const users = await getUserFromPG();
    res.send({ data: users });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = router;
