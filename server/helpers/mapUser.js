module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    roleId: user.role,
    registeredAt: user.createdAt,
  };
};
