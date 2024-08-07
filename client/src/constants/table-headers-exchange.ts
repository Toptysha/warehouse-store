import { Order } from "../interfaces";
import { formatDateFromDb } from "../utils";

export const tableHeadersExchange = (order?: Order, isReturned?: boolean) => {
	const products = order ? (isReturned ? order.product[order.product.length - 2] : order.product[order.product.length - 1]) : []

	const productsArticle = products.map(product => ({
		id: product.productId,
		article: product.productArticle,
	}))
	return [
		{key: 'Цена', value: order ? order.totalPrice : ''},
		{key: 'Дата заказа', value: order ? formatDateFromDb(order.createdAt) : ''},
		{key: 'Дата обмена/возврата', value: order ? formatDateFromDb(order.updatedAt) : ''},
		{key: 'Товары', value: order ? productsArticle : []},
		{key: 'Продавец', value: order ? order.authorName as string : ''}
	]
};
