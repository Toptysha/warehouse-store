const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/users", require("./user"));
router.use("/products", require("./product"));
router.use("/orders", require("./order"));
router.use("/logs", require("./log"));

module.exports = router;
