import { TotalStats, UnionSellerStats } from "../interfaces"

export const salesStatsCount = (sellerStats: UnionSellerStats): TotalStats => {
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

	sellerStats.onlineSellerStats.forEach((order)  =>  {
		currentMonthOnlineSellsTotalRevenueAmount += Number(order.currentMonthRevenueAmount)
		lastMonthOnlineSellsTotalRevenueAmount += Number(order.lastMonthRevenueAmount)
		currentMonthOnlineSellsTotalProductsAmount += Number(order.currentMonthProductsAmount)
		lastMonthOnlineSellsTotalProductsAmount += Number(order.lastMonthProductsAmount)
		currentMonthOnlineSellersTotalWage += Number(order.currentMonthWage)
		lastMonthOnlineSellersTotalWage += Number(order.lastMonthWage)
	})
	sellerStats.offlineSellerStats.forEach((order)  =>  {
		currentMonthOfflineSellsTotalRevenueAmount += Number(order.currentMonthRevenueAmount)
		lastMonthOfflineSellsTotalRevenueAmount += Number(order.lastMonthRevenueAmount)
		currentMonthOfflineSellsTotalProductsAmount += Number(order.currentMonthProductsAmount)
		lastMonthOfflineSellsTotalProductsAmount += Number(order.lastMonthProductsAmount)
		currentMonthOfflineSellersTotalWage += Number(order.currentMonthWage)
		lastMonthOfflineSellersTotalWage += Number(order.lastMonthWage)
	})
	sellerStats.allSellerStats.forEach((order)  =>  {
		currentMonthTotalRevenueAmount += Number(order.currentMonthRevenueAmount)
		lastMonthTotalRevenueAmount += Number(order.lastMonthRevenueAmount)
		currentMonthTotalProductsAmount += Number(order.currentMonthProductsAmount)
		lastMonthTotalProductsAmount += Number(order.lastMonthProductsAmount)
		currentMonthTotalWage += Number(order.currentMonthWage)
		lastMonthTotalWage += Number(order.lastMonthWage)
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
