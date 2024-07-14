const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    deliveryType: { type: String, required: true },
    isExchange: { type: Boolean, required: true },
    orders: [
      [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          size: { type: String, required: true },
          price: { type: String, required: true },
        },
      ],
    ],
    deliveryPrice: { type: String, required: true },
    totalPrice: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
