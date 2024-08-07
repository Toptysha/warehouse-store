module.exports = function (log, users, products) {
  const userDict = users.reduce((acc, user) => {
    acc[user.id] = user.login;
    return acc;
  }, {});

  const productDict = products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  const getProductDetails = (productId) => {
    const product = productDict[productId];
    return product ? { id: product.id, article: product.article } : null;
  };

  return {
    author: userDict[log.authorId.toString()] || "Unknown",
    action: log.action,
    product: log.product && {
      id: log.product.id,
      isChangedCovers: log.product.isChangedCovers,
      isChangedMeasurements: log.product.isChangedMeasurements,
      changedMeasurementsSize: log.product.changedMeasurementsSize,
      article: log.product.article,
      brandOld: log.product.brandOld,
      nameOld: log.product.nameOld,
      colorOld: log.product.colorOld,
      priceOld: log.product.priceOld,
      sizesOld: log.product.sizesOld,
      brandNew: log.product.brandNew,
      nameNew: log.product.nameNew,
      colorNew: log.product.colorNew,
      priceNew: log.product.priceNew,
      sizesNew: log.product.sizesNew,
    },
    order: log.order && {
      id: log.order.id,
      nameOld: log.order.nameOld,
      phoneOld: log.order.phoneOld,
      addressOld: log.order.addressOld,
      deliveryTypeOld: log.order.deliveryTypeOld,
      deliveryPriceOld: log.order.deliveryPriceOld,
      productsOld:
        log.order.productsOld && log.order.productsOld.map(getProductDetails),
      nameNew: log.order.nameNew,
      phoneNew: log.order.phoneNew,
      addressNew: log.order.addressNew,
      deliveryTypeNew: log.order.deliveryTypeNew,
      deliveryPriceNew: log.order.deliveryPriceNew,
      productsNew:
        log.order.productsNew && log.order.productsNew.map(getProductDetails),
    },
    user: log.user && {
      id: userDict[log.user.id] || "Unknown",
      name: log.user.name || "Unknown",
      roleOld: log.user.roleOld,
      roleNew: log.user.roleNew,
    },
    createdAt: log.createdAt,
  };
};
