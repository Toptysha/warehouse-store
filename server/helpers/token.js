const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma-service");
const TOKENS_LIFE = require("../constants/tokens-time-life");

const generateTokens = (data) => ({
  accessToken: jwt.sign(data, process.env.JWT_ACCESS_SECRET, {
    expiresIn: TOKENS_LIFE.ACCESS_FOR_GENERATE,
  }),
  refreshToken: jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
    expiresIn: TOKENS_LIFE.REFRESH_FOR_GENERATE,
  }),
});

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Пользователь не авторизован");
  }

  const userData = verifyRefreshToken(refreshToken);

  const tokenFromDb = await prisma.user.findUnique({
    where: { token: refreshToken },
  });

  if (!userData || !tokenFromDb) {
    throw new Error("Пользователь не авторизован");
  }

  const newTokens = generateTokens({ id: userData.id });

  return {
    accessToken: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
    userId: userData.id,
  };
};

const setTokensInDbAndCookie = async (req, res) => {
  const { accessToken, refreshToken, userId } = await refreshAccessToken(
    req.cookies.refreshToken
  );

  const user = prisma.user.update({
    where: { id: Number(userId) },
    data: { token: refreshToken },
  });

  res
    .cookie("accessToken", accessToken, {
      maxAge: TOKENS_LIFE.ACCESS,
      httpOnly: true,
      domain: ".warehouse-store.online",
      secure: true, // при использовании https
    })
    .cookie("refreshToken", refreshToken, {
      maxAge: TOKENS_LIFE.REFRESH,
      httpOnly: true,
      domain: ".warehouse-store.online",
      secure: true,
    });

  return user;
};

const checkTimeToEndAccessToken = async (req, res) => {
  if (!req.cookies.accessToken) {
    throw new Error("User not found");
  }

  const decodedAccessToken = verifyAccessToken(req.cookies.accessToken);
  const now = Math.floor(Date.now() / 1000);
  const exp = decodedAccessToken.exp;
  const remainingTime = exp - now;

  if (remainingTime < TOKENS_LIFE.FORCE_UPDATE) {
    const user = await setTokensInDbAndCookie(req, res);
    return user;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(decodedAccessToken.id),
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  setTokensInDbAndCookie,
  checkTimeToEndAccessToken,
};
