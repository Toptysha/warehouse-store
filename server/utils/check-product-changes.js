function checkProductChanges(oldProduct, newProduct) {
  let check = false;

  if (
    oldProduct.brand !== newProduct.brand ||
    oldProduct.name !== newProduct.name ||
    oldProduct.color !== newProduct.color ||
    oldProduct.price !== newProduct.price ||
    oldProduct.sizes.length !== newProduct.sizes.length
  ) {
    check = true;
  }

  oldProduct.sizes.forEach((size) => {
    if (!newProduct.sizes.includes(size)) {
      check = true;
    }
  });

  return check;
}

module.exports = {
  checkProductChanges,
};
