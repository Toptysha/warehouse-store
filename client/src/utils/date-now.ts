export const dateNow = () => {
	const date = new Date()

	const dayOfDate = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate().toString();
	const monthOfDate = (date.getMonth() + 1).toString().length < 2 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1).toString();
	const yearOfDate = `${date.getFullYear().toString()[2]}${date.getFullYear().toString()[3]}`
	const hoursOfDate = date.getHours().toString().length < 2? `0${date.getHours()}` : date.getHours().toString();
	const minutesOfDate = date.getMinutes().toString().length < 2? `0${date.getMinutes()}` : date.getMinutes().toString();
	const secondsOfDate = date.getSeconds().toString().length < 2? `0${date.getSeconds()}` : date.getSeconds().toString();

	return `${dayOfDate}.${monthOfDate}.${yearOfDate} - ${hoursOfDate}:${minutesOfDate}:${secondsOfDate}`
};
