import { Order, TotalStats } from "../interfaces"

export const salesStatsCount = (ordersByCurrentMonth: Order[], ordersByLastMonth: Order[]): TotalStats => {
	let currentMonthOnlineSellsTotalRevenueAmount = 0
	let currentMonthOfflineSellsTotalRevenueAmount = 0
	let currentMonthTotalRevenueAmount = 0
	let lastMonthOnlineSellsTotalRevenueAmount = 0
	let	lastMonthOfflineSellsTotalRevenueAmount = 0
	let lastMonthTotalRevenueAmount = 0
	let currentMonthOnlineSellsTotalProductsAmount = 0
	let currentMonthOfflineSellsTotalProductsAmount = 0
	let currentMonthTotalProductsAmount = 0
	let lastMonthOnlineSellsTotalProductsAmount = 0
	let	lastMonthOfflineSellsTotalProductsAmount = 0
	let lastMonthTotalProductsAmount = 0
	let	currentMonthOnlineSellersTotalWage = 0
	let	currentMonthOfflineSellersTotalWage = 0
	let currentMonthTotalWage = 0
	let	lastMonthOnlineSellersTotalWage = 0
	let	lastMonthOfflineSellersTotalWage = 0
	let lastMonthTotalWage = 0

	ordersByCurrentMonth.forEach((order) => {
		if (order.address === 'offline') {
			currentMonthOfflineSellsTotalRevenueAmount += Number(order.totalPrice)
			currentMonthTotalRevenueAmount += Number(order.totalPrice)
			currentMonthOfflineSellsTotalProductsAmount += order.product.length;
			currentMonthTotalProductsAmount += order.product.length;
		} else if (order.address !== 'offline') {
			currentMonthOnlineSellsTotalRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice)
			currentMonthTotalRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice)
			currentMonthOnlineSellsTotalProductsAmount += order.product.length;
			currentMonthTotalProductsAmount += order.product.length;
		}
	})

	ordersByLastMonth.forEach((order) => {
		if (order.address === 'offline') {
			lastMonthOfflineSellsTotalRevenueAmount += Number(order.totalPrice)
			lastMonthTotalRevenueAmount += Number(order.totalPrice)
			lastMonthOfflineSellsTotalProductsAmount += order.product.length;
			lastMonthTotalProductsAmount += order.product.length;
		} else if (order.address !== 'offline') {
			lastMonthOnlineSellsTotalRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice)
			lastMonthTotalRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice)
			lastMonthOnlineSellsTotalProductsAmount += order.product.length;
			lastMonthTotalProductsAmount += order.product.length;
		}
	})

	currentMonthOnlineSellersTotalWage = Math.round((currentMonthOnlineSellsTotalRevenueAmount / 100) * 3.5)
	currentMonthOfflineSellersTotalWage = Math.round((currentMonthOfflineSellsTotalRevenueAmount / 100) * 5)
	currentMonthTotalWage = currentMonthOnlineSellersTotalWage + currentMonthOfflineSellersTotalWage
	lastMonthOnlineSellersTotalWage = Math.round((lastMonthOnlineSellsTotalRevenueAmount / 100) * 3.5)
	lastMonthOfflineSellersTotalWage = Math.round((lastMonthOfflineSellsTotalRevenueAmount / 100) * 5)
	lastMonthTotalWage = lastMonthOnlineSellersTotalWage + lastMonthOfflineSellersTotalWage

	return {
		currentMonthOnlineSellsTotalRevenueAmount,
		currentMonthOfflineSellsTotalRevenueAmount,
		currentMonthTotalRevenueAmount,
		lastMonthOnlineSellsTotalRevenueAmount,
		lastMonthOfflineSellsTotalRevenueAmount,
		lastMonthTotalRevenueAmount,
		currentMonthOnlineSellsTotalProductsAmount,
		currentMonthOfflineSellsTotalProductsAmount,
		currentMonthTotalProductsAmount,
		lastMonthOnlineSellsTotalProductsAmount,
		lastMonthOfflineSellsTotalProductsAmount,
		lastMonthTotalProductsAmount,
		currentMonthOnlineSellersTotalWage,
		currentMonthOfflineSellersTotalWage,
		currentMonthTotalWage,
		lastMonthOnlineSellersTotalWage,
		lastMonthOfflineSellersTotalWage,
		lastMonthTotalWage,
	}
}
