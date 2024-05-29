module.exports = function (order) {
  return {
    id: order.id,
    name: order.name,
    phone: order.phone,
    address: order.address,
    delivery: order.delivery,
    products: order.orders.map(({ product, size, price }) => ({
      productId: product,
      size,
      price,
    })),
    totalPrice: order.totalPrice,
    authorId: order.author,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
