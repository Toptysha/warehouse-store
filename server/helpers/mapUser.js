module.exports = function (user) {
  return {
    id: user.id.toString(),
    login: user.login,
    phone: user.phone,
    roleId: user.role.toString(),
    color: user.color ? user.color : "",
    registeredAt: user.createdAt,
  };
};
