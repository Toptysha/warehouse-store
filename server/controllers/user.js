const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken, verifyToken } = require("../helpers/token");
const ROLES = require("../constants/roles");

async function register(login, phone, password) {
  if (!password) {
    throw new Error("Password is empty");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ login, phone, password: hashPassword });

  const token = generateToken({ id: user.id });

  return {
    user,
    token,
  };
}

async function login(phone, password) {
  const user = await User.findOne({ phone });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ id: user.id });

  return {
    user,
    token,
  };
}

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    {
      id: ROLES.ADMIN,
      name: "Admin",
    },
    {
      id: ROLES.EDITOR,
      name: "Editor",
    },
    {
      id: ROLES.SELLER_ONLINE,
      name: "SellerOnline",
    },
    {
      id: ROLES.SELLER_ON_STORE,
      name: "SellerOnStore",
    },
    {
      id: ROLES.USER,
      name: "User",
    },
    {
      id: ROLES.GUEST,
      name: "Guest",
    },
  ];
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function editUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

async function checkAuth(token) {
  if (!token) {
    throw new Error("User not found");
  }

  const tokenData = verifyToken(token);
  const user = await User.findOne({ _id: tokenData.id });

  return user;
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  editUser,
  checkAuth,
};
