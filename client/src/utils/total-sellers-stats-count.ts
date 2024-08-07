import { Order, SelectedDate, SellerStats, User } from "../interfaces"
import { calculateDifferenceExchanges } from "./calculate -difference-exchanges";
import { countAllSellsInMonth } from "./count-all-sells-in-month";
import { countAllSellsWithExchangesOfCurrentMonth } from "./count-all-sells-with-exchanges-of-current-month";

interface DaysInMonth {
	currentMonth: number
	lastMonth: number
};

export const totalSellersStatsCount = (
	users: User[],
	ordersByCurrentMonth: Order[],
	ordersByLastMonth: Order[],
	scheduleByCurrentMonth: SelectedDate[],
	scheduleByLastMonth: SelectedDate[],
	daysInMonth: DaysInMonth
): SellerStats[] | undefined[] => {

	const allSellsInCurrentMonth = countAllSellsInMonth(users, ordersByCurrentMonth, scheduleByCurrentMonth, daysInMonth.currentMonth)
	const allSellsInLastMonth = countAllSellsInMonth(users, ordersByLastMonth, scheduleByLastMonth, daysInMonth.lastMonth)

	const exchangesOfCurrentMonth = calculateDifferenceExchanges(ordersByCurrentMonth)
	const exchangesOfLastMonth = calculateDifferenceExchanges(ordersByLastMonth)

	const allSellsWithExchangesOfCurrentMonth = countAllSellsWithExchangesOfCurrentMonth({
		allSellsInMonth: allSellsInCurrentMonth,
		exchangesOfMonth: exchangesOfCurrentMonth,
		daysInMonth: daysInMonth.currentMonth,
	})

	const allSellsWithExchangesOfLastMonth = countAllSellsWithExchangesOfCurrentMonth({
		allSellsInMonth: allSellsInLastMonth,
		exchangesOfMonth: exchangesOfLastMonth,
		daysInMonth: daysInMonth.lastMonth,
	})

	const unionSellersStats: SellerStats[] | undefined[] = users.map((user) => {
		let unionSellers: SellerStats | undefined = undefined
		allSellsWithExchangesOfCurrentMonth.forEach((seller, index) => {
			if (seller.sellerId === user.id) {
				unionSellers = {
					sellerId: user.id,
					sellerName: user.login,
					amountOfWorkDaysInCurrentMonth: seller.amountOfWorkDays,
					totalOfflinePriceInCurrentMonth: Math.round(seller.totalOfflinePrice),
					totalOnlinePriceInCurrentMonth: Math.round(seller.totalOnlinePrice),
					totalOfflineProductsInCurrentMonth: Math.round(seller.totalOfflineProducts),
					totalOnlineProductsInCurrentMonth: Math.round(seller.totalOnlineProducts),
					offlineWageInCurrentMonth: Math.round(seller.offlineWage),
					onlineWageInCurrentMonth: Math.round(seller.onlineWage),
					amountOfWorkDaysInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].amountOfWorkDays),
					totalOfflinePriceInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].totalOfflinePrice),
					totalOnlinePriceInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].totalOnlinePrice),
					totalOfflineProductsInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].totalOfflineProducts),
					totalOnlineProductsInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].totalOnlineProducts),
					offlineWageInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].offlineWage),
					onlineWageInLastMonth: Math.round(allSellsWithExchangesOfLastMonth[index].onlineWage),
				}
			}
		})
		return unionSellers
	})

	return unionSellersStats
}
