const mongoose = require("mongoose");
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

async function getOrdersWithExchange(search = "", limit = 10, page = 1) {
  const searchConditions = [
    { authorName: { $regex: search, $options: "i" } },
    { totalPrice: { $regex: search, $options: "i" } },
  ];

  const [orders, countOrders] = await Promise.all([
    Order.find({
      isExchange: true,
      $or: searchConditions,
    })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 }),
    Order.countDocuments({
      isExchange: true,
      $or: searchConditions,
    }),
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

async function editOrder(id, order, newProduct) {
  if (newProduct) {
    try {
      updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          ...order,
          $push: {
            orders: { $each: [newProduct] },
          },
        },
        {
          new: true,
        }
      );
      return updatedOrder;
    } catch (error) {
      console.log("ERR", error);
    }
  } else {
    try {
      updatedOrder = await Order.findByIdAndUpdate(
        id,
        { ...order },
        { new: true }
      );
      return updatedOrder;
    } catch (error) {
      console.log("ERR", error);
    }
  }
}

function deleteOrder(id) {
  return Order.deleteOne({ _id: id });
}

async function isProductUsedEarly(productId) {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const orders = await Order.aggregate([
    // Фильтруем документы, которые были обновлены в течение последних 60 дней
    { $match: { updatedAt: { $gte: sixtyDaysAgo } } },
    // Проецируем только те поля, которые нам нужны
    { $project: { orders: 1 } },
    // Добавляем поле, содержащее последний элемент массива orders
    { $addFields: { lastOrder: { $arrayElemAt: ["$orders", -1] } } },
    // Разворачиваем массив lastOrder для дальнейшей фильтрации
    { $unwind: "$lastOrder" },
    // Фильтруем документы, содержащие указанный productId
    { $match: { "lastOrder.product": new mongoose.Types.ObjectId(productId) } },
    // Возвращаем только поле _id (или любое другое, если нужно)
    { $project: { _id: 1 } },
  ]);

  return orders.length > 0;
}

module.exports = {
  addOrder,
  getOrders,
  getOrdersWithExchange,
  getOrder,
  getOrdersByDate,
  editOrder,
  deleteOrder,
  isProductUsedEarly,
};
