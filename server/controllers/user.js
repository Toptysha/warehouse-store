const bcrypt = require("bcrypt");
const User = require("../models/User");
// const Token = require("../models/Token");
const { generateAccessToken, verifyToken } = require("../helpers/token");
const ROLES = require("../constants/roles");

async function register(login, phone, password) {
  if (!password) {
    throw new Error("Password is empty");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ login, phone, password: hashPassword });

  // const refreshToken = generateAccessToken({ id: user.id });
  const accessToken = generateAccessToken({ id: user.id });

  return {
    user,
    token: accessToken,
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

  const token = generateAccessToken({ id: user.id });

  return {
    user,
    token,
  };
}

function getUser(id) {
  return User.findById(id);
}

function getUsers() {
  return User.find();
}

function getUsersByRoles(roles) {
  return User.find({ role: { $in: roles } });
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

async function getUserNameForOrders(orders) {
  const ordersWithUserNames = await Promise.all(
    orders.map(async (order) => {
      const user = await User.findById(order.authorId);
      return { ...order, author: user.login };
    })
  );

  return ordersWithUserNames;
}

module.exports = {
  register,
  login,
  getUser,
  getUsers,
  getUsersByRoles,
  getRoles,
  deleteUser,
  editUser,
  checkAuth,
  getUserNameForOrders,
};
