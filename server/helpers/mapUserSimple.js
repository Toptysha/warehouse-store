module.exports = function (user) {
  return {
    id: user.id.toString(),
    login: user.login,
    color: user.color ? user.color : "",
  };
};
