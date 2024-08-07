import { OFFLINE_DEAL } from "../constants"
import { Order, SelectedDate, User } from "../interfaces"
import { onlineSellersIds } from "./online-sellers-work-days";

export const countAllSellsInMonth = (users: User[], ordersByMonth: Order[], scheduleByMonth: SelectedDate[], daysInMonth: number) => {

    const sellersWorkDays = onlineSellersIds(scheduleByMonth);  // Получаем объект с количеством отработанных дней для каждого продавца

    const result: Record<string, {
		sellerId: string,
        totalOnlinePrice: number,
        totalOnlineProducts: number,
        onlineWage: number,
        totalOfflinePrice: number,
        totalOfflineProducts: number,
        offlineWage: number,
		amountOfWorkDays: number
    }> = {};

	users.forEach(({id}) => {
		if (!result[id]) {
			result[id] = {
				sellerId: id,
				totalOnlinePrice: 0,
				totalOnlineProducts: 0,
				onlineWage: 0,
				totalOfflinePrice: 0,
				totalOfflineProducts: 0,
				offlineWage: 0,
				amountOfWorkDays: sellersWorkDays[id] ? sellersWorkDays[id] : 0
			};
		}
	});


    // Обрабатываем все заказы
    ordersByMonth.forEach(order => {
        const authorId = order.authorId;

        if (order.phone !== OFFLINE_DEAL) {
            // Обновляем значения для онлайн-продавца
            const totalOrderPrice = Number(order.totalPrice);
            const totalProducts = order.product[order.product.length - 1].length;

            // Добавляем онлайн данные
            result[authorId].totalOnlinePrice += totalOrderPrice;
            result[authorId].totalOnlineProducts += totalProducts;

            // Рассчитываем заработную плату и добавляем ко всем продавцам
            const wage = (totalOrderPrice * 0.07) / daysInMonth;
            for (const sellerId in sellersWorkDays) {
                if (sellersWorkDays.hasOwnProperty(sellerId)) {
                    result[sellerId].onlineWage += wage * sellersWorkDays[sellerId];
                }
            }
        } else {
            // Обновляем значения для офлайн-продавца
            const totalOrderPrice = Number(order.totalPrice);
            const totalProducts = order.product[order.product.length - 1].length;

            result[authorId].totalOfflinePrice += totalOrderPrice;
            result[authorId].totalOfflineProducts += totalProducts;
            result[authorId].offlineWage += totalOrderPrice * 0.05;
        }
    });

    // Преобразуем результат в массив объектов
    const resultArray = Object.values(result).map((data) => ({...data}));

    return resultArray;
};
