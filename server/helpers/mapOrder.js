module.exports = function (order, author) {
  return {
    id: order.id,
    name: order.name,
    phone: order.phone,
    address: order.address,
    deliveryType: order.deliveryType,
    deliveryPrice: order.deliveryPrice,
    isExchange: order.isExchange,
    product: order.orders.map((oneOfOrder) =>
      oneOfOrder.map(({ product, size, price }) => ({
        productId: product,
        productArticle: product,
        size,
        price,
      }))
    ),
    totalPrice: order.totalPrice,
    authorId: order.author,
    authorName: author.login,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
