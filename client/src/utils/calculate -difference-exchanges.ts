import { OFFLINE_DEAL, ONLINE_DEAL } from "../constants";
import { Order, SaleProduct } from "../interfaces";

export const calculateDifferenceExchanges = (ordersByMonth: Order[]) => {
    const results: { orderId: string; orderAuthor: string; orderType: string; priceDifference: number }[] = [];

    ordersByMonth.forEach(order => {
        if (order.isExchange) {
			if (new Date(order.createdAt).getMonth() !== new Date(order.updatedAt).getMonth()) {
				let allDatesUpdated: SaleProduct[][] = []

				let i = new Date(order.product[0][0].createdAt).getMonth()

				let lastExchangeInMonth: SaleProduct[] = []
				order.product.forEach((products, index) => {
					const monthOfCurrentExchange = new Date(products[0].createdAt).getMonth()


						if (i !== monthOfCurrentExchange) {
							i = monthOfCurrentExchange
							allDatesUpdated.push(lastExchangeInMonth);
						} else {
							lastExchangeInMonth = products;
						}

						index === order.product.length - 1 && allDatesUpdated.push(products)

				})

				const lastProductsInCurrentMonth = allDatesUpdated[allDatesUpdated.length - 1]
				const lastProductsInLastMonth = allDatesUpdated[allDatesUpdated.length - 2]

				// Суммируем цены
				const currentMonthTotal = lastProductsInCurrentMonth.reduce((acc, {price}) => acc + parseFloat(price === '' ? '0' : price), 0);
				const previousMonthTotal = lastProductsInLastMonth.reduce((acc, {price}) => acc + parseFloat(price === '' ? '0' : price), 0);

				const priceDifference = currentMonthTotal - previousMonthTotal;

				// Записываем результат в массив
				results.push({
					orderId: order.id,
					orderAuthor: order.authorId,
					orderType: order.phone === OFFLINE_DEAL ? OFFLINE_DEAL : ONLINE_DEAL,
					priceDifference
				});
        	}
		}
    });

    return results;
};
