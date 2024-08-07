const { prisma } = require("../prisma-service");

function addOrder(order) {
  return prisma.order.create({ data: order });
}

async function getOrders(search = "", limit = 10, page = 1) {
  const where = {
    OR: [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { deliveryType: { contains: search, mode: "insensitive" } },
      { totalPrice: { contains: search, mode: "insensitive" } },
    ],
  };

  const [orders, countOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      take: Number(limit),
      skip: limit * (page - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    lastPage: Math.ceil(countOrders / limit),
  };
}

async function getOrdersWithExchange(search = "", limit = 10, page = 1) {
  const where = {
    isExchange: true,
    OR: [
      // { authorName: { contains: search, mode: "insensitive" } },
      // { orders: { contains: search, mode: "insensitive" } },
      { totalPrice: { contains: search, mode: "insensitive" } },
    ],
  };

  const [orders, countOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      take: Number(limit),
      skip: limit * (page - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    lastPage: Math.ceil(countOrders / limit),
  };
}

function getOrder(id) {
  return prisma.order.findUnique({
    where: {
      id: Number(id),
    },
  });
}

async function getOrdersByDate(startDate, endDate) {
  return prisma.order.findMany({
    where: {
      updatedAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  });
}

async function editOrder(id, order, newProduct) {
  try {
    if (newProduct[0]) {
      // Получаем текущий заказ
      const existingOrder = await getOrder(id);

      const orderProducts = existingOrder.orders.set
        ? existingOrder.orders.set
        : existingOrder.orders;

      // Обновляем заказ и добавляем новый продукт в массив
      const updatedOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: {
          ...order,
          orders: {
            set: orderProducts.concat(newProduct),
          },
        },
      });

      return updatedOrder;
    } else {
      // Обновляем заказ без добавления нового продукта
      const updatedOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: {
          ...order,
        },
      });

      return updatedOrder;
    }
  } catch (error) {
    throw error;
  }
}

function deleteOrder(id) {
  return prisma.order.delete({
    where: { id: Number(id) },
  });
}

async function isProductUsedEarly(productId) {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Получаем все заказы, обновленные в течение последних 60 дней
  const orders = await prisma.order.findMany({
    where: {
      updatedAt: {
        gte: sixtyDaysAgo.toISOString(),
      },
    },
    select: {
      id: true,
      orders: true,
    },
  });

  // Проверяем только последний массив в orders
  for (const order of orders) {
    let orderProducts = order.orders;

    // Проверяем, если ли у объекта orders ключ "set" и извлекаем массив, если он есть
    if (
      orderProducts &&
      typeof orderProducts === "object" &&
      "set" in orderProducts
    ) {
      orderProducts = orderProducts.set;
    }

    // Если orders представляет собой массив массивов, проверяем последний массив
    if (Array.isArray(orderProducts) && orderProducts.length > 0) {
      const lastProductGroup = orderProducts[orderProducts.length - 1]; // Последний массив

      // Проверяем продукты в последнем массиве
      for (const product of lastProductGroup) {
        if (Number(product.product) === Number(productId)) {
          return true;
        }
      }
    }
  }

  return false;
}

module.exports = {
  addOrder,
  getOrders,
  getOrdersWithExchange,
  getOrder,
  getOrdersByDate,
  editOrder,
  deleteOrder,
  isProductUsedEarly,
};
