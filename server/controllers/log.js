const LOG_ACTIONS = require("../constants/log-actions");
const PHOTOS_TYPE = require("../constants/photos-type");
const Log = require("../models/Log");

function getLogs() {
  return Log.find();
}

async function deleteAllLogs() {
  try {
    await Log.deleteMany({});
    console.log("All logs have been deleted");
  } catch (error) {
    console.error("Error deleting logs:", error);
  }
}

async function addProductLog(authorId, productId, productArticle) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.PRODUCT_ACTIONS.ADD,
    product: { id: productId, article: productArticle },
  });

  return newLog;
}

async function deleteProductLog(authorId, productId, productArticle) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE,
    product: { id: productId, article: productArticle },
  });

  return newLog;
}

async function changeProductInfoLog(
  authorId,
  productId,
  oldProductInfo,
  newProductInfo
) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.PRODUCT_ACTIONS.UPDATE_INFO,
    product: {
      id: productId,
      article: oldProductInfo.article,
      brandOld: oldProductInfo.brand,
      nameOld: oldProductInfo.name,
      colorOld: oldProductInfo.color,
      priceOld: oldProductInfo.price,
      sizesOld: oldProductInfo.sizes,
      brandNew: newProductInfo.brand,
      nameNew: newProductInfo.name,
      colorNew: newProductInfo.color,
      priceNew: newProductInfo.price,
      sizesNew: newProductInfo.sizes,
    },
  });

  return newLog;
}

async function addProductPhotosLog(
  authorId,
  productId,
  productArticle,
  typePhotos,
  currentSize
) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.PRODUCT_ACTIONS.ADD_PHOTOS,
    product: {
      id: productId,
      article: productArticle,
      isChangedCovers: typePhotos === PHOTOS_TYPE.TYPE_COVER,
      isChangedMeasurements: typePhotos === PHOTOS_TYPE.TYPE_MEASUREMENTS,
      changedMeasurementsSize: currentSize,
    },
  });

  return newLog;
}

async function removeProductPhotosLog(
  authorId,
  productId,
  productArticle,
  typePhotos,
  currentSize
) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE_PHOTOS,
    product: {
      id: productId,
      article: productArticle,
      isChangedCovers: typePhotos === PHOTOS_TYPE.TYPE_COVER,
      isChangedMeasurements: typePhotos === PHOTOS_TYPE.TYPE_MEASUREMENTS,
      changedMeasurementsSize: currentSize,
    },
  });

  return newLog;
}

async function addOrderLog(authorId, orderId) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.ORDER_ACTIONS.ADD,
    order: { id: orderId },
  });

  return newLog;
}

async function changeOrderInfoLog(
  authorId,
  orderId,
  oldOrderInfo,
  newOrderInfo
) {
  const preLastProduct =
    oldOrderInfo.orders[oldOrderInfo.orders.length - 1][0].product;
  const lastProduct =
    newOrderInfo.orders[newOrderInfo.orders.length - 1][0].product;

  const oldProducts =
    preLastProduct !== null &&
    oldOrderInfo.orders[oldOrderInfo.orders.length - 1].map(
      (products) => products.product
    );
  const newProducts =
    lastProduct !== null &&
    newOrderInfo.orders[newOrderInfo.orders.length - 1].map(
      (products) => products.product
    );

  const newLog =
    lastProduct === null
      ? await Log.create({
          author: authorId,
          action: LOG_ACTIONS.ORDER_ACTIONS.CANCEL,
          order: {
            id: orderId,
          },
        })
      : preLastProduct === null
      ? await Log.create({
          author: authorId,
          action: LOG_ACTIONS.ORDER_ACTIONS.CANCEL_CANCELLATION,
          order: {
            id: orderId,
          },
        })
      : await Log.create({
          author: authorId,
          action: LOG_ACTIONS.ORDER_ACTIONS.UPDATE,
          order: {
            id: orderId,
            nameOld: oldOrderInfo.name,
            phoneOld: oldOrderInfo.phone,
            addressOld: oldOrderInfo.address,
            deliveryTypeOld: oldOrderInfo.deliveryType,
            deliveryPriceOld: oldOrderInfo.deliveryPrice,
            productsOld: oldProducts,
            nameNew: newOrderInfo.name,
            phoneNew: newOrderInfo.phone,
            addressNew: newOrderInfo.address,
            deliveryTypeNew: newOrderInfo.deliveryType,
            deliveryPriceNew: newOrderInfo.deliveryPrice,
            productsNew: newProducts,
          },
        });

  return newLog;
}

async function changeUserRoleLog(authorId, userId, roleOld, roleNew) {
  const newLog = await Log.create({
    author: authorId,
    action: LOG_ACTIONS.USER_ACTIONS.UPDATE_ROLE,
    user: {
      id: userId,
      roleOld,
      roleNew,
    },
  });

  return newLog;
}

module.exports = {
  getLogs,
  deleteAllLogs,
  addProductLog,
  deleteProductLog,
  changeProductInfoLog,
  addProductPhotosLog,
  removeProductPhotosLog,
  addOrderLog,
  changeOrderInfoLog,
  changeUserRoleLog,
};
