export const getDaysInMonth = (year: number, month: number): number[] => {
	const date = new Date(year, month, 1);
	const days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date).getDate());
		date.setDate(date.getDate() + 1);
	}
	return days;
};
