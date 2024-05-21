module.exports = function (roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.send({ error: "Access denied" });
      return;
    }

    next();
  };
};
