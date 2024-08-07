import { SellerStats, TotalStats} from "../interfaces"

export const totalStatsCount = (
	sellerStats: SellerStats[],
): TotalStats => {

	let statsCount: TotalStats = {
		totalOfflinePriceInCurrentMonth: 0,
		totalOnlinePriceInCurrentMonth: 0,
		totalOfflineProductsInCurrentMonth: 0,
		totalOnlineProductsInCurrentMonth: 0,
		offlineWageInCurrentMonth: 0,
		onlineWageInCurrentMonth: 0,
		totalOfflinePriceInLastMonth: 0,
		totalOnlinePriceInLastMonth: 0,
		totalOfflineProductsInLastMonth: 0,
		totalOnlineProductsInLastMonth: 0,
		offlineWageInLastMonth: 0,
		onlineWageInLastMonth: 0,
	}

	sellerStats.forEach(seller => {
		statsCount = {
			totalOfflinePriceInCurrentMonth: statsCount.totalOfflinePriceInCurrentMonth + seller.totalOfflinePriceInCurrentMonth,
			totalOnlinePriceInCurrentMonth: statsCount.totalOnlinePriceInCurrentMonth + seller.totalOnlinePriceInCurrentMonth,
			totalOfflineProductsInCurrentMonth: statsCount.totalOfflineProductsInCurrentMonth + seller.totalOfflineProductsInCurrentMonth,
			totalOnlineProductsInCurrentMonth: statsCount.totalOnlineProductsInCurrentMonth + seller.totalOnlineProductsInCurrentMonth,
			offlineWageInCurrentMonth: statsCount.offlineWageInCurrentMonth + seller.offlineWageInCurrentMonth,
			onlineWageInCurrentMonth: statsCount.onlineWageInCurrentMonth + seller.onlineWageInCurrentMonth,
			totalOfflinePriceInLastMonth: statsCount.totalOfflinePriceInLastMonth + seller.totalOfflinePriceInLastMonth,
			totalOnlinePriceInLastMonth: statsCount.totalOnlinePriceInLastMonth + seller.totalOnlinePriceInLastMonth,
			totalOfflineProductsInLastMonth: statsCount.totalOfflineProductsInLastMonth + seller.totalOfflineProductsInLastMonth,
			totalOnlineProductsInLastMonth: statsCount.totalOnlineProductsInLastMonth + seller.totalOnlineProductsInLastMonth,
			offlineWageInLastMonth: statsCount.offlineWageInLastMonth + seller.offlineWageInLastMonth,
			onlineWageInLastMonth: statsCount.onlineWageInLastMonth + seller.onlineWageInLastMonth,
		}
	})

return statsCount
}
