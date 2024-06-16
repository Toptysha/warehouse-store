export const trimmingText = (text: string, value: number) => {
	return text.length > value? text.slice(0, value) + '...' : text
}
