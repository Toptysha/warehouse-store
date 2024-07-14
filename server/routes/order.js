const express = require("express");

const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const ACCESS = require("../constants/access");
const {
  addOrder,
  getOrders,
  getOrder,
  getOrdersByDate,
  deleteOrder,
  editOrder,
  getOrdersWithExchange,
  isProductUsedEarly,
} = require("../controllers/order");
const mapOrder = require("../helpers/mapOrder");
const { getUserNameForOrders, getUser } = require("../controllers/user");
const { getProductArticlesForOrders } = require("../controllers/product");
const { addOrderLog, changeOrderInfoLog } = require("../controllers/log");
const { checkOrderChanges } = require("../utils/check-order-changes");

const router = express.Router({ mergeParams: true });

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
      const ordersWithAuthorName = await getUserNameForOrders(
        orders.map(mapOrder)
      );
      const ordersWithProductArticles = await getProductArticlesForOrders(
        ordersWithAuthorName
      );
      res.send({
        data: { orders: ordersWithProductArticles, lastPage },
      });
    } catch (err) {
      console.log("ERR GET_ORDERS");
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.get(
  "/exchanges",
  authenticated,
  hasRole(ACCESS.WATCH_ORDERS),
  async (req, res) => {
    try {
      const { orders, lastPage } = await getOrdersWithExchange(
        req.query.search,
        req.query.limit,
        req.query.page
      );
      const ordersWithAuthorName = await getUserNameForOrders(
        orders.map(mapOrder)
      );
      const ordersWithProductArticles = await getProductArticlesForOrders(
        ordersWithAuthorName
      );
      res.send({
        data: { orders: ordersWithProductArticles, lastPage },
      });
    } catch (err) {
      console.log("ERR GET_ORDERS");
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
      const author = await getUser(order.author);
      res.send({ data: mapOrder(order, author) });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error", errorPath: err.path });
    }
  }
);

// fake post по факту get
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
        isExchange: req.body.isExchange,
        orders: req.body.orders,
        totalPrice: req.body.totalPrice,
        author: req.user._id,
      });

      await addOrderLog(req.user._id, newOrder._id);

      res.send({ data: newOrder });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole(ACCESS.EDIT_ORDERS),
  async (req, res) => {
    try {
      const oldOrder = await getOrder(req.params.id);

      const updatedOrder = await editOrder(
        req.params.id,
        {
          isExchange: req.body.isExchange,
          totalPrice: req.body.totalPrice,
          name: req.body.name,
          address: req.body.address,
          deliveryType: req.body.deliveryType,
          deliveryPrice: req.body.deliveryPrice,
          phone: req.body.phone,
        },
        req.body.orders
      );

      if (checkOrderChanges(oldOrder, updatedOrder)) {
        await changeOrderInfoLog(
          req.user._id,
          req.params.id,
          oldOrder,
          updatedOrder
        );
      }

      res.send({ data: updatedOrder });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole(ACCESS.EDIT_ORDERS),
  async (req, res) => {
    try {
      await deleteOrder(req.params.id);
      res.send({ data: "Order was deleted" });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

// fake post по факту get
router.post(
  "/check_product_in_orders",
  authenticated,
  hasRole(ACCESS.EDIT_ORDERS),
  async (req, res) => {
    try {
      const isCanDeleteProduct = await isProductUsedEarly(req.body.productId);

      res.send({ data: isCanDeleteProduct });
    } catch (err) {
      res.send({ error: err.message || "Unknown Error" });
    }
  }
);

module.exports = router;
