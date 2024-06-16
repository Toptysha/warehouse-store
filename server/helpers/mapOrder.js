module.exports = function (order) {
  return {
    id: order.id,
    name: order.name,
    phone: order.phone,
    address: order.address,
    deliveryType: order.deliveryType,
    deliveryPrice: order.deliveryPrice,
    product: order.orders.map(({ product, size, price }) => ({
      productId: product,
      productArticle: product,
      size,
      price,
    })),
    totalPrice: order.totalPrice,
    authorId: order.author,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
