import { dateNow } from "./date-now"

export const createArticle = () => {
	let article = dateNow().replaceAll('.', '').replaceAll(' ', '').replaceAll('-', '').replaceAll(':', '')

	return article
}
