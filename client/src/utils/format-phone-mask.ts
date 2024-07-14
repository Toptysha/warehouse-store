export const phoneFormat = (phone: string) => {
	return phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '')
}
