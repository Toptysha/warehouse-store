const LOG_ACTIONS = require("../constants/log-actions");
const PHOTOS_TYPE = require("../constants/photos-type");
const { prisma } = require("../prisma-service");

function getLogs() {
  return prisma.log.findMany();
}

function deleteAllLogs() {
  prisma.log.deleteMany({});
}

function addProductLog(authorId, productId, productArticle) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.PRODUCT_ACTIONS.ADD,
      product: { id: productId, article: productArticle },
    },
  });
}

function deleteProductLog(authorId, productId, productArticle) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE,
      product: { id: productId, article: productArticle },
    },
  });
}

function changeProductInfoLog(
  authorId,
  productId,
  oldProductInfo,
  newProductInfo
) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
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
    },
  });
}

function addProductPhotosLog(
  authorId,
  productId,
  productArticle,
  typePhotos,
  currentSize
) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.PRODUCT_ACTIONS.ADD_PHOTOS,
      product: {
        id: productId,
        article: productArticle,
        isChangedCovers: typePhotos === PHOTOS_TYPE.TYPE_COVER,
        isChangedMeasurements: typePhotos === PHOTOS_TYPE.TYPE_MEASUREMENTS,
        changedMeasurementsSize: currentSize,
      },
    },
  });
}

function removeProductPhotosLog(
  authorId,
  productId,
  productArticle,
  typePhotos,
  currentSize
) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE_PHOTOS,
      product: {
        id: productId,
        article: productArticle,
        isChangedCovers: typePhotos === PHOTOS_TYPE.TYPE_COVER,
        isChangedMeasurements: typePhotos === PHOTOS_TYPE.TYPE_MEASUREMENTS,
        changedMeasurementsSize: currentSize,
      },
    },
  });
}

function addOrderLog(authorId, orderId) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.ORDER_ACTIONS.ADD,
      order: { id: orderId },
    },
  });
}

async function changeOrderInfoLog(
  authorId,
  orderId,
  oldOrderInfo,
  newOrderInfo
) {
  const oldOrders = oldOrderInfo.orders.set
    ? oldOrderInfo.orders.set
    : oldOrderInfo.orders;
  const newOrders = newOrderInfo.orders.set
    ? newOrderInfo.orders.set
    : newOrderInfo.orders;

  const preLastProduct = oldOrders[oldOrders.length - 1][0].product;
  const lastProduct = newOrders[newOrders.length - 1][0].product;

  const oldProducts =
    preLastProduct !== null &&
    oldOrders[oldOrders.length - 1].map((products) => products.product);

  const newProducts =
    lastProduct !== null &&
    newOrders[newOrders.length - 1].map((products) => products.product);

  const newLog =
    lastProduct === null
      ? await prisma.log.create({
          data: {
            author: {
              connect: { id: authorId },
            },
            action: LOG_ACTIONS.ORDER_ACTIONS.CANCEL,
            order: {
              id: orderId,
            },
          },
        })
      : preLastProduct === null
      ? await prisma.log.create({
          data: {
            author: {
              connect: { id: authorId },
            },
            action: LOG_ACTIONS.ORDER_ACTIONS.CANCEL_CANCELLATION,
            order: {
              id: orderId,
            },
          },
        })
      : await prisma.log.create({
          data: {
            author: {
              connect: { id: authorId },
            },
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
          },
        });

  return newLog;
}

function changeUserRoleLog(authorId, userId, userName, roleOld, roleNew) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.USER_ACTIONS.UPDATE_ROLE,
      user: {
        id: userId,
        name: userName,
        roleOld,
        roleNew,
      },
    },
  });
}

function deleteUserLog(authorId, userId, userName) {
  return prisma.log.create({
    data: {
      author: {
        connect: { id: authorId },
      },
      action: LOG_ACTIONS.USER_ACTIONS.DELETE,
      user: {
        id: userId,
        name: userName,
      },
    },
  });
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
  deleteUserLog,
};
