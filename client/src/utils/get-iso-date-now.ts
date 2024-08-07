export const getIsoDateNow = () => {

	const currentTime = new Date();
	currentTime.setHours(currentTime.getHours() + 3);

return currentTime.toISOString();
}
