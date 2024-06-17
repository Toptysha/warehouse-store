import { OFFLINE_DEAL } from "../constants";
import { Order, SellerStats, UnionSellerStats, User } from "../interfaces"

export const sellersStatsCount = (users: User[], ordersByCurrentMonth: Order[], ordersByLastMonth: Order[]): UnionSellerStats => {
	let allSellerStats: SellerStats[] = [];
	let onlineSellerStats: SellerStats[] = [];
	let offlineSellerStats: SellerStats[] = [];

	const userStat = users.map((user: User) => {
		let allSellsCurrentMonthRevenueAmount: number = 0;
		let allSellsLastMonthRevenueAmount: number = 0;
		let allSellsCurrentMonthProductsAmount: number = 0;
		let allSellsLastMonthProductsAmount: number = 0;

		let onlineSellsCurrentMonthRevenueAmount: number = 0;
		let onlineSellsLastMonthRevenueAmount: number = 0;
		let onlineSellsCurrentMonthProductsAmount: number = 0;
		let onlineSellsLastMonthProductsAmount: number = 0;

		let offlineSellsCurrentMonthRevenueAmount: number = 0;
		let offlineSellsLastMonthRevenueAmount: number = 0;
		let offlineSellsCurrentMonthProductsAmount: number = 0;
		let offlineSellsLastMonthProductsAmount: number = 0;

		ordersByCurrentMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsCurrentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
					allSellsCurrentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsCurrentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
					allSellsCurrentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				}
			}
		});
		ordersByLastMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
					allSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
					allSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				}
			}
		});
		ordersByCurrentMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsCurrentMonthProductsAmount += order.product.length;
					allSellsCurrentMonthProductsAmount += order.product.length;
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsCurrentMonthProductsAmount += order.product.length;
					allSellsCurrentMonthProductsAmount += order.product.length;
				}
			}
		});
		ordersByLastMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsLastMonthProductsAmount += order.product.length;
					allSellsLastMonthProductsAmount += order.product.length;
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsLastMonthProductsAmount += order.product.length;
					allSellsLastMonthProductsAmount += order.product.length;
				}
			}
		});

		return {
			allSellerStats: {
				seller: user.login,
				currentMonthRevenueAmount: `${allSellsCurrentMonthRevenueAmount}`,
				lastMonthRevenueAmount: `${allSellsLastMonthRevenueAmount}`,
				currentMonthProductsAmount: `${allSellsCurrentMonthProductsAmount}`,
				lastMonthProductsAmount: `${allSellsLastMonthProductsAmount}`,
				currentMonthWage: `${Math.round((allSellsCurrentMonthRevenueAmount / 100) * 3.5)}`,
				lastMonthWage: `${Math.round((allSellsLastMonthRevenueAmount / 100) * 3.5)}`,
			},
			onlineSellerStats: {
				seller: user.login,
				currentMonthRevenueAmount: `${onlineSellsCurrentMonthRevenueAmount}`,
				lastMonthRevenueAmount: `${onlineSellsLastMonthRevenueAmount}`,
				currentMonthProductsAmount: `${onlineSellsCurrentMonthProductsAmount}`,
				lastMonthProductsAmount: `${onlineSellsLastMonthProductsAmount}`,
				currentMonthWage: `${Math.round((onlineSellsCurrentMonthRevenueAmount / 100) * 3.5)}`,
				lastMonthWage: `${Math.round((onlineSellsLastMonthRevenueAmount / 100) * 3.5)}`,
			},
			offlineSellerStats: {
				seller: user.login,
				currentMonthRevenueAmount: `${offlineSellsCurrentMonthRevenueAmount}`,
				lastMonthRevenueAmount: `${offlineSellsLastMonthRevenueAmount}`,
				currentMonthProductsAmount: `${offlineSellsCurrentMonthProductsAmount}`,
				lastMonthProductsAmount: `${offlineSellsLastMonthProductsAmount}`,
				currentMonthWage: `${Math.round((offlineSellsCurrentMonthRevenueAmount / 100) * 5)}`,
				lastMonthWage: `${Math.round((offlineSellsLastMonthRevenueAmount / 100) * 5)}`,
			}
		};
	})

	userStat.forEach((user) => {
		allSellerStats.push(user.allSellerStats)
		onlineSellerStats.push(user.onlineSellerStats)
		offlineSellerStats.push(user.offlineSellerStats)
	})

	return {
		allSellerStats,
		onlineSellerStats,
		offlineSellerStats
	}
}
