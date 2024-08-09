const { prisma } = require("../prisma-service");

async function getScheduleByMonth(year, month) {
  const startDate = new Date(year, month - 1, 1); // Первый день месяца
  const endDate = new Date(year, month, 1); // Первый день следующего месяца

  return await prisma.schedule.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      sellers: {
        include: {
          user: true, // Включаем данные о пользователях
        },
      },
    },
  });
}

async function getLastSchedule() {
  return await prisma.schedule.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

async function addSchedule(schedules) {
  const upsertPromises = schedules.map(async (schedule) => {
    let sellersData = [];
    if (
      schedule.sellers.length > 0 &&
      !(schedule.sellers.length === 1 && schedule.sellers[0] === 0)
    ) {
      sellersData = schedule.sellers.map((sellerId) => ({
        userId: Number(sellerId),
      }));
    }

    const { date, authorId, createdAt, updatedAt } = schedule;

    const existingSchedule = await prisma.schedule.findUnique({
      where: { date: new Date(date) },
      include: { sellers: true },
    });

    if (existingSchedule) {
      const existingSellerIds = existingSchedule.sellers.map(
        (seller) => seller.userId
      );
      const newSellerIds = sellersData.map((seller) => seller.userId);

      const sellersToRemove = existingSellerIds.filter(
        (id) => !newSellerIds.includes(id)
      );
      const sellersToAdd = newSellerIds.filter(
        (id) => !existingSellerIds.includes(id)
      );

      return prisma.schedule.update({
        where: { date: new Date(date) },
        data: {
          sellers: {
            deleteMany: {
              userId: { in: sellersToRemove },
            },
            create: sellersToAdd.map((sellerId) => ({
              userId: sellerId,
            })),
          },
          authorId: Number(authorId),
          updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        },
      });
    } else {
      return prisma.schedule.create({
        data: {
          date: new Date(date),
          sellers: {
            create: sellersData,
          },
          authorId: Number(authorId),
          createdAt: createdAt ? new Date(createdAt) : new Date(),
          updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        },
      });
    }
  });

  return Promise.all(upsertPromises);
}

async function deleteScheduleByMonth(year, month) {
  // Определение первого дня месяца и первого дня следующего месяца
  const startDate = new Date(year, month - 1, 1); // Первый день месяца
  const endDate = new Date(year, month, 1); // Первый день следующего месяца

  try {
    // Удаление записей из таблицы ScheduleUser, которые ссылаются на расписания в указанном диапазоне
    await prisma.scheduleUser.deleteMany({
      where: {
        schedule: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
    });

    // Удаление расписаний, где дата попадает в указанный диапазон
    const deletedSchedules = await prisma.schedule.deleteMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    console.log(
      `Deleted ${deletedSchedules.count} schedules for ${year}-${month}`
    );
    return deletedSchedules.count;
  } catch (error) {
    console.error("Error deleting schedules:", error);
    throw error; // Проброс ошибки для обработки на более высоком уровне
  } finally {
    await prisma.$disconnect(); // Закрытие подключения к базе данных
  }
}

module.exports = {
  getScheduleByMonth,
  getLastSchedule,
  addSchedule,
  deleteScheduleByMonth,
};
