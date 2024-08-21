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
const { checkPassAndUpdate } = require("../utils/check-pass");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole(ACCESS.GET_USERS), async (req, res) => {
  try {
    const users = await getUsers();

    const updatedUsers = users.map((user) => ({
      ...mapUser(user),
      reservePass: user.reservePass,
    }));

    res.send({ data: updatedUsers });
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

router.get(
  "/roles",
  authenticated,
  hasRole(ACCESS.GET_USERS),
  async (req, res) => {
    const roles = getRoles();
    res.send({ data: roles });
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole(ACCESS.GET_USERS),
  async (req, res) => {
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
  }
);

router.post(
  "/change_main_info",
  authenticated,
  hasRole(ACCESS.AUTH),
  async (req, res) => {
    try {
      const user = await getUser(req.body.id);

      const { isVerify, newPass, newReservePass } = await checkPassAndUpdate(
        user.password,
        user.reservePass,
        req.body.oldPass,
        req.body.newPass
      );

      if (isVerify) {
        const newUser = await editUser(req.body.id, {
          login: req.body.login ? req.body.login : user.login,
          phone: req.body.phone ? req.body.phone : user.phone,
          password: newPass ? newPass : user.password,
          reservePass: newReservePass ? newReservePass : user.reservePass,
        });
        res.send({ data: true });
      } else {
        res.send({ data: false });
      }
    } catch (error) {
      res.send({ error: error.message });
    }
  }
);

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
  hasRole(ACCESS.GET_USERS),
  async (req, res) => {
    const deletedUser = await getUser(req.params.id);

    await deleteUser(req.params.id);

    await deleteUserLog(req.user.id, req.params.id, deletedUser.login);

    res.send({ error: null });
  }
);

module.exports = router;
