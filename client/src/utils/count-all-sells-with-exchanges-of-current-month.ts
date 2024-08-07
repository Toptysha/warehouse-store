import { OFFLINE_DEAL } from "../constants";

interface props {
	allSellsInMonth: {
		totalOnlinePrice: number;
		totalOnlineProducts: number;
		onlineWage: number;
		totalOfflinePrice: number;
		totalOfflineProducts: number;
		offlineWage: number;
		amountOfWorkDays: number;
		sellerId: string;
	}[],
    exchangesOfMonth: {
		orderId: string;
		orderAuthor: string;
		orderType: string;
		priceDifference: number;
	}[],
	daysInMonth: number;
}

export const countAllSellsWithExchangesOfCurrentMonth = ({allSellsInMonth, exchangesOfMonth, daysInMonth}: props) => {

	let summaryOfflineSells: {id: string; price: number}[] = []
	let summaryOnlineSells = 0
	exchangesOfMonth.forEach(exchange => {
		if (exchange.orderType !== OFFLINE_DEAL) {
			summaryOnlineSells += exchange.priceDifference
		} else {
			summaryOfflineSells.push({id: exchange.orderAuthor, price: exchange.priceDifference * 0.05})
		}
	})

	const updatedOnlineWage = allSellsInMonth.map(person => {

		let updatedPerson = {...person}
		if (person.amountOfWorkDays !== 0) {
			summaryOfflineSells.forEach((sell) => {
				if (sell.id === person.sellerId) {
					updatedPerson = {
						...person,
						offlineWage: person.offlineWage + sell.price,
						onlineWage: person.onlineWage + (summaryOnlineSells * 0.07 / daysInMonth * person.amountOfWorkDays)}
				} else {
					updatedPerson = {...person, onlineWage: person.onlineWage + (summaryOnlineSells * 0.07 / daysInMonth * person.amountOfWorkDays)}
				}
			})
		} else {
			summaryOfflineSells.forEach((sell) => {
				if (sell.id === person.sellerId) {
					updatedPerson = {...person, offlineWage: person.offlineWage + sell.price}
				}
			})
		}

		return updatedPerson

	})

	return updatedOnlineWage
}
