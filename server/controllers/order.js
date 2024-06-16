const Order = require("../models/Order");

async function addOrder(order) {
  const newOrder = await Order.create(order);

  return newOrder;
}

async function getOrders(search = "", limit = 10, page = 1) {
  const [orders, countOrders] = await Promise.all([
    Order.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { deliveryType: { $regex: search, $options: "i" } },
        { totalPrice: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 }),
    Order.countDocuments(
      { name: { $regex: search, $options: "i" } } || {
          phone: { $regex: search, $options: "i" },
        } || { address: { $regex: search, $options: "i" } } || {
          deliveryType: { $regex: search, $options: "i" },
        } || { totalPrice: { $regex: search, $options: "i" } }
    ),
  ]);

  return {
    orders,
    lastPage: Math.ceil(countOrders / limit),
  };
}

function getOrder(id) {
  return Order.findById(id);
}

function getOrdersByDate(startDate, endDate) {
  return Order.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  });
}

module.exports = {
  addOrder,
  getOrders,
  getOrder,
  getOrdersByDate,
};
