export interface SellerStats {
	seller: string;
	currentMonthRevenueAmount: string;
	lastMonthRevenueAmount: string;
	currentMonthProductsAmount: string;
	lastMonthProductsAmount: string;
	currentMonthWage: string;
	lastMonthWage: string;
}

export interface UnionSellerStats {
	allSellerStats: SellerStats[];
	onlineSellerStats: SellerStats[];
	offlineSellerStats: SellerStats[];
}
