export interface SellerStats {
	sellerId: string;
	sellerName: string;
	amountOfWorkDaysInCurrentMonth: number;
	totalOfflinePriceInCurrentMonth: number;
	totalOnlinePriceInCurrentMonth: number;
	totalOfflineProductsInCurrentMonth: number;
	totalOnlineProductsInCurrentMonth: number;
	offlineWageInCurrentMonth: number;
	onlineWageInCurrentMonth: number;
	amountOfWorkDaysInLastMonth: number;
	totalOfflinePriceInLastMonth: number;
	totalOnlinePriceInLastMonth: number;
	totalOfflineProductsInLastMonth: number;
	totalOnlineProductsInLastMonth: number;
	offlineWageInLastMonth: number;
	onlineWageInLastMonth: number;
}
export interface TotalStats {
	totalOfflinePriceInCurrentMonth: number;
	totalOnlinePriceInCurrentMonth: number;
	totalOfflineProductsInCurrentMonth: number;
	totalOnlineProductsInCurrentMonth: number;
	offlineWageInCurrentMonth: number;
	onlineWageInCurrentMonth: number;
	totalOfflinePriceInLastMonth: number;
	totalOnlinePriceInLastMonth: number;
	totalOfflineProductsInLastMonth: number;
	totalOnlineProductsInLastMonth: number;
	offlineWageInLastMonth: number;
	onlineWageInLastMonth: number;
}
