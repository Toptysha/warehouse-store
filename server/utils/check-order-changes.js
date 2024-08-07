function checkOrderChanges(oldOrder, newOrder) {
  const oldOrders = oldOrder.orders.set ? oldOrder.orders.set : oldOrder.orders;
  const newOrders = newOrder.orders.set ? newOrder.orders.set : newOrder.orders;

  let isChanged = false;

  if (
    oldOrder.name !== newOrder.name ||
    oldOrder.phone !== newOrder.phone ||
    oldOrder.address !== newOrder.address ||
    oldOrder.deliveryType !== newOrder.deliveryType ||
    oldOrder.deliveryPrice !== newOrder.deliveryPrice ||
    oldOrders[oldOrders.length - 1].length !==
      newOrders[newOrders.length - 1].length
  ) {
    isChanged = true;
  }

  oldOrders[oldOrders.length - 1].forEach(({ product, size, price }, index) => {
    if (
      newOrders[newOrders.length - 1][index].product !== product ||
      newOrders[newOrders.length - 1][index].size !== size ||
      newOrders[newOrders.length - 1][index].price !== price
    ) {
      isChanged = true;
    }
  });

  return isChanged;
}

module.exports = {
  checkOrderChanges,
};
