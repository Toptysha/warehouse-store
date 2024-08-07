module.exports = function (order) {
  const productFromOrders = order.orders.set ? order.orders.set : order.orders;
  return {
    id: order.id.toString(),
    name: order.name,
    phone: order.phone,
    address: order.address,
    deliveryType: order.deliveryType,
    deliveryPrice: order.deliveryPrice,
    isExchange: order.isExchange,
    product: productFromOrders.map((oneOfOrder) =>
      oneOfOrder.map(({ product, size, price, createdAt }) => ({
        productId: product,
        productArticle: product,
        size,
        price,
        createdAt,
      }))
    ),
    totalPrice: order.totalPrice,
    authorId: order.authorId.toString(),
    authorName: order.authorName,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
