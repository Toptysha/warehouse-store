const bcrypt = require("bcrypt");
const { generateTokens, verifyAccessToken } = require("../helpers/token");
const ROLES = require("../constants/roles");
const { prisma } = require("../prisma-service");
const { generateRandomString } = require("../utils/generate-random-string");

async function register(login, phone, password) {
  if (!password) {
    throw new Error("Password is empty");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const reservePass = await bcrypt.hash(generateRandomString(32), 10);

  const user = await prisma.user.create({
    data: { login, phone, password: hashPassword, reservePass, token: login },
  });

  const { accessToken, refreshToken } = generateTokens({ id: user.id });

  const userWithRefreshToken = await editUser(user.id, { token: refreshToken });

  return {
    user: userWithRefreshToken,
    accessToken,
    refreshToken,
  };
}

async function login(phone, password) {
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    throw new Error("такой номер телефона не зарегестрирован");
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  const isMatchReservePass = password === user.reservePass;

  if (!isMatchPassword && !isMatchReservePass) {
    throw new Error("не верный пароль");
  }

  if (isMatchReservePass) {
    const newReservePass = await bcrypt.hash(generateRandomString(32), 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { reservePass: newReservePass },
    });
  }

  const { accessToken, refreshToken } = generateTokens({ id: user.id });

  await editUser(user.id, { token: refreshToken });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

function getUser(id) {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
}

function getUsers() {
  return prisma.user.findMany();
}

function getUsersByRoles(roles) {
  return prisma.user.findMany({
    where: {
      role: {
        in: roles,
      },
    },
  });
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
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

function editUser(id, userData) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: userData,
  });
}

async function checkAuth(token) {
  if (!token) {
    throw new Error("User not found");
  }

  const tokenData = verifyAccessToken(token);
  const user = await getUser(tokenData.id);

  return user;
}

async function getUserNameForOrders(orders) {
  const ordersWithUserNames = await Promise.all(
    orders.map(async (order) => {
      const user = await prisma.user.findUnique({
        where: { id: Number(order.authorId) },
        select: { login: true },
      });

      return { ...order, authorName: user.login };
    })
  );

  return ordersWithUserNames;
}

async function findTokenByUserId(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { token: true },
  });

  return user.token;
}

function findUserByToken(token) {
  return prisma.user.findUnique({
    where: { token },
  });
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
  findTokenByUserId,
  findUserByToken,
};
