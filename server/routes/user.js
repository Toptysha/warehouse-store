const express = require("express");
const {
  getUser,
  getUsers,
  getRoles,
  editUser,
  deleteUser,
} = require("../controllers/user");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const ACCESS = require("../constants/access");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole(ACCESS.USERS), async (req, res) => {
  try {
    const users = await getUsers();
    res.send({ data: users.map(mapUser) });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get(
  "/:id",
  authenticated,
  hasRole(ACCESS.WATCH_PRODUCTS),
  async (req, res) => {
    try {
      const user = await getUser(req.params.id);
      res.send({ data: mapUser(user) });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

router.get("/roles", authenticated, hasRole(ACCESS.USERS), async (req, res) => {
  const roles = getRoles();
  res.send({ data: roles });
});

router.patch("/:id", authenticated, hasRole(ACCESS.USERS), async (req, res) => {
  try {
    const newUser = await editUser(req.params.id, {
      role: req.body.roleId,
    });

    res.send({ data: mapUser(newUser) });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete(
  "/:id",
  authenticated,
  hasRole(ACCESS.USERS),
  async (req, res) => {
    await deleteUser(req.params.id);

    res.send({ error: null });
  }
);

module.exports = router;
