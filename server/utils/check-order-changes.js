function checkOrderChanges(oldOrder, newOrder) {
  if (
    oldOrder.name !== newOrder.name ||
    oldOrder.phone !== newOrder.phone ||
    oldOrder.address !== newOrder.address ||
    oldOrder.deliveryType !== newOrder.deliveryType ||
    oldOrder.deliveryPrice !== newOrder.deliveryPrice ||
    oldOrder.orders[oldOrder.orders.length - 1].length !==
      newOrder.orders[newOrder.orders.length - 1].length
  ) {
    return true;
  }

  oldOrder.orders[oldOrder.orders.length - 1].forEach(
    ({ product, size, price }, index) => {
      if (
        newOrder.orders[newOrder.orders.length - 1][index].product !==
          product ||
        newOrder.orders[newOrder.orders.length - 1][index].size !== size ||
        newOrder.orders[newOrder.orders.length - 1][index].price !== price
      ) {
        return true;
      }
    }
  );

  return false;
}

module.exports = {
  checkOrderChanges,
};
