module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    phone: user.phone,
    roleId: user.role,
    registeredAt: user.createdAt,
  };
};
