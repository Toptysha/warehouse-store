import { OFFLINE_DEAL } from "../constants";
import { Order, SellerStats, UnionTotalStats, User } from "../interfaces"
import { salesStatsCount } from "./sales-stats-count";

export const totalStatsCount = (users: User[], ordersByCurrentMonth: Order[], ordersByLastMonth: Order[]): UnionTotalStats => {
	let allSellerStats: SellerStats[] = [];
	let onlineSellerStats: SellerStats[] = [];
	let offlineSellerStats: SellerStats[] = [];

	const userStat = users.map((user: User) => {

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
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsCurrentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				}
			}
		});
		ordersByLastMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsLastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
				}
			}
		});
		ordersByCurrentMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsCurrentMonthProductsAmount += order.product[order.product.length - 1].length;
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsCurrentMonthProductsAmount += order.product[order.product.length - 1].length;
				}
			}
		});
		ordersByLastMonth.forEach((order: Order) => {
			if (order.authorId === user.id) {
				if (order.address !== OFFLINE_DEAL) {
					onlineSellsLastMonthProductsAmount += order.product[order.product.length - 1].length;
				} else if (order.address === OFFLINE_DEAL) {
					offlineSellsLastMonthProductsAmount += order.product[order.product.length - 1].length;
				}
			}
		});

		return {
			allSellerStats: {
				seller: user.login,
				currentMonthRevenueAmount: `${onlineSellsCurrentMonthRevenueAmount + offlineSellsCurrentMonthRevenueAmount}`,
				lastMonthRevenueAmount: `${onlineSellsLastMonthRevenueAmount + offlineSellsLastMonthRevenueAmount}`,
				currentMonthProductsAmount: `${onlineSellsCurrentMonthProductsAmount + offlineSellsCurrentMonthProductsAmount}`,
				lastMonthProductsAmount: `${onlineSellsLastMonthProductsAmount + offlineSellsLastMonthProductsAmount}`,
				currentMonthWage: `${Math.round((onlineSellsCurrentMonthRevenueAmount / 100) * 3.5) + Math.round((offlineSellsCurrentMonthRevenueAmount / 100) * 5)}`,
				lastMonthWage: `${Math.round((onlineSellsLastMonthRevenueAmount / 100) * 3.5) + Math.round((offlineSellsLastMonthRevenueAmount / 100) * 5)}`,
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

	const total = salesStatsCount({allSellerStats, onlineSellerStats, offlineSellerStats})

	return {
		allSellerStats,
		onlineSellerStats,
		offlineSellerStats,
		currentMonthOnlineSellsTotalRevenueAmount: total.currentMonthOnlineSellsTotalRevenueAmount,
		currentMonthOfflineSellsTotalRevenueAmount: total.currentMonthOfflineSellsTotalRevenueAmount,
		currentMonthTotalRevenueAmount: total.currentMonthTotalRevenueAmount,
		lastMonthOnlineSellsTotalRevenueAmount: total.lastMonthOnlineSellsTotalRevenueAmount,
		lastMonthOfflineSellsTotalRevenueAmount: total.lastMonthOfflineSellsTotalRevenueAmount,
		lastMonthTotalRevenueAmount: total.lastMonthTotalRevenueAmount,
		currentMonthOnlineSellsTotalProductsAmount: total.currentMonthOnlineSellsTotalProductsAmount,
		currentMonthOfflineSellsTotalProductsAmount: total.currentMonthOfflineSellsTotalProductsAmount,
		currentMonthTotalProductsAmount: total.currentMonthTotalProductsAmount,
		lastMonthOnlineSellsTotalProductsAmount: total.lastMonthOnlineSellsTotalProductsAmount,
		lastMonthOfflineSellsTotalProductsAmount: total.lastMonthOfflineSellsTotalProductsAmount,
		lastMonthTotalProductsAmount: total.lastMonthTotalProductsAmount,
		currentMonthOnlineSellersTotalWage: total.currentMonthOnlineSellersTotalWage,
		currentMonthOfflineSellersTotalWage: total.currentMonthOfflineSellersTotalWage,
		currentMonthTotalWage: total.currentMonthTotalWage,
		lastMonthOnlineSellersTotalWage: total.lastMonthOnlineSellersTotalWage,
		lastMonthOfflineSellersTotalWage: total.lastMonthOfflineSellersTotalWage,
		lastMonthTotalWage: total.lastMonthTotalWage,
	}
}
