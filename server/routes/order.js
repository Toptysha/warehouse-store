const express = require("express");

const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ACCESS = require("../constants/access");
const {
  addOrder,
  getOrders,
  getOrder,
  getOrdersByDate,
} = require("../controllers/order");
const mapOrder = require("../helpers/mapOrder");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  authenticated,
  hasRole(ACCESS.EDIT_ORDERS),
  async (req, res) => {
    try {
      const newOrder = await addOrder({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        deliveryType: req.body.deliveryType,
        deliveryPrice: req.body.deliveryPrice,
        orders: req.body.orders,
        totalPrice: req.body.totalPrice,
        author: req.user._id,
      });

      res.send({ data: newOrder });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const { orders, lastPage } = await getOrders(
        req.query.search,
        req.query.limit,
        req.query.page
      );
      res.send({
        data: { orders: orders.map(mapOrder), lastPage },
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/:id",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const order = await getOrder(req.params.id);
      res.send({ data: mapOrder(order) });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

router.post(
  "/by_date",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const orders = await getOrdersByDate(
        req.body.startDate,
        req.body.endDate
      );
      res.send({
        data: orders.map(mapOrder),
      });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

module.exports = router;
