const express = require("express");
const {
  getUsers,
  getRoles,
  editUser,
  deleteUser,
} = require("../controllers/user");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const users = await getUsers();
  res.send({ data: users.map(mapUser) });
});

router.get(
  "/roles",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const roles = getRoles();
    res.send({ data: roles });
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newUser = await editUser(req.params.id, {
      role: req.body.roleId,
    });

    res.send({ data: mapUser(newUser) });
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deleteUser(req.params.id);

    res.send({ error: null });
  }
);

module.exports = router;
