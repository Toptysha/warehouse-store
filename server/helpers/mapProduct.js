const { sortSizes } = require("../utils/sort-sizes");

module.exports = function (product) {
  return product !== null
    ? {
        id: product.id.toString(),
        name: product.name,
        article: product.article,
        brand: product.brand,
        color: product.color,
        price: product.price,
        sizes: sortSizes(product.sizes),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }
    : null;
};
