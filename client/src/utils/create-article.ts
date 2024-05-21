import { dateNow } from "./date-now"

export const createArticle = () => {
	let article = dateNow().replaceAll('.', '').replaceAll(' ', '').replaceAll('-', '').replaceAll(':', '')
	// let article = Math.round(Number(dateNow().replaceAll('.', '').replaceAll(' ', '').replaceAll('-', '').replaceAll(':', '')) / 1).toString()
	// let modifyArticle = ''

	// if (article.length < 8) {
	// 	for (let i = 0; i < 8 - article.length; i++) {
	// 		modifyArticle += '0'
	// 	}
	// 	modifyArticle += article
	// 	return modifyArticle
	// }

	// if (article.length > 8) {
	// 	modifyArticle = article
	// 	for (let i = 0; i < article.length - 8; i++) {
	// 		console.log(article,i, modifyArticle)
	// 		modifyArticle = modifyArticle.slice(0, -1)
	// 	}
	// 	return modifyArticle
	// }

	return article
}
