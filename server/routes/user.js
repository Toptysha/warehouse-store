const express = require("express");
const {
  getUser,
  getUsers,
  getRoles,
  editUser,
  deleteUser,
  getUsersByRoles,
} = require("../controllers/user");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const mapUserSimple = require("../helpers/mapUserSimple");
const ACCESS = require("../constants/access");
const { changeUserRoleLog, deleteUserLog } = require("../controllers/log");

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
  "/get_color",
  authenticated,
  hasRole(ACCESS.GET_USER),
  async (req, res) => {
    try {
      const users = await getUsers();
      res.send({ data: users.map(mapUserSimple) });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
);

router.get(
  "/:id",
  authenticated,
  hasRole(ACCESS.GET_USER),
  async (req, res) => {
    try {
      const user = await getUser(req.params.id);
      res.send({ data: mapUser(user) });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

router.post(
  "/by_roles",
  authenticated,
  hasRole(ACCESS.GET_USER),
  async (req, res) => {
    try {
      const intRoles = req.body.roleIds.map((role) => Number(role));
      const users = await getUsersByRoles(intRoles);
      res.send({ data: users.map(mapUser) });
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
    const oldUser = await getUser(req.params.id);

    const newUser = await editUser(req.params.id, {
      role: Number(req.body.roleId),
    });

    await changeUserRoleLog(
      req.user.id,
      req.params.id,
      oldUser.login,
      oldUser.role,
      newUser.role
    );

    res.send({ data: mapUser(newUser) });
  } catch (error) {
    res.send({ error: error.message });
  }
});

router.post(
  "/change_color",
  authenticated,
  hasRole(ACCESS.GET_USER),
  async (req, res) => {
    try {
      const newUser = await editUser(req.body.id, {
        color: req.body.color,
      });

      res.send({ data: mapUser(newUser) });
    } catch (error) {
      res.send({ error: error.message });
    }
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole(ACCESS.USERS),
  async (req, res) => {
    const deletedUser = await getUser(req.params.id);

    await deleteUser(req.params.id);

    await deleteUserLog(req.user.id, req.params.id, deletedUser.login);

    res.send({ error: null });
  }
);

module.exports = router;
