const mongoose = require("mongoose");

const LogSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    product: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      isChangedCovers: { type: Boolean },
      isChangedMeasurements: { type: Boolean },
      changedMeasurementsSize: { type: String },
      article: { type: String },
      brandOld: { type: String },
      nameOld: { type: String },
      colorOld: { type: String },
      priceOld: { type: String },
      sizesOld: [{ type: String }],
      brandNew: { type: String },
      nameNew: { type: String },
      colorNew: { type: String },
      priceNew: { type: String },
      sizesNew: [{ type: String }],
    },
    order: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
      nameOld: { type: String },
      phoneOld: { type: String },
      addressOld: { type: String },
      deliveryTypeOld: { type: String },
      deliveryPriceOld: { type: String },
      productsOld: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      nameNew: { type: String },
      phoneNew: { type: String },
      addressNew: { type: String },
      deliveryTypeNew: { type: String },
      deliveryPriceNew: { type: String },
      productsNew: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    },
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      roleOld: { type: Number },
      roleNew: { type: Number },
    },
  },
  { timestamps: true }
);

LogSchema.pre("save", function (next) {
  if (this.product.sizesOld && this.product.sizesOld.length === 0) {
    this.product.sizesOld = undefined;
  }
  if (this.product.sizesNew && this.product.sizesNew.length === 0) {
    this.product.sizesNew = undefined;
  }
  if (this.order.productsOld && this.order.productsOld.length === 0) {
    this.order.productsOld = undefined;
  }
  if (this.order.productsNew && this.order.productsNew.length === 0) {
    this.order.productsNew = undefined;
  }
  next();
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
