import { SelectedDate } from "../interfaces";

export const onlineSellersIds = (scheduleByMonth: SelectedDate[]) => {
	const sellerDaysCount: Record<string, number> = {};

	scheduleByMonth.forEach(schedule => {
		schedule.sellerIds.forEach(sellerId => {
			if (sellerDaysCount[sellerId]) {
				sellerDaysCount[sellerId] += 1;
			} else {
				sellerDaysCount[sellerId] = 1;
			}
		});
	});

	return sellerDaysCount;
};
