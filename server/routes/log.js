const express = require("express");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const ACCESS = require("../constants/access");
const { getLogs } = require("../controllers/log");
const { getUsers } = require("../controllers/user");
const mapLog = require("../helpers/mapLog");
const { getProducts } = require("../controllers/product");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole(ACCESS.LOGS), async (req, res) => {
  try {
    const logs = await getLogs();

    const users = await getUsers();

    const { products } = await getProducts();

    res.send({ data: logs.map((log) => mapLog(log, users, products)) });
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
