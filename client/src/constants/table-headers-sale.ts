import { Order } from "../interfaces";
import { formatDateFromDb, trimmingText } from "../utils";

export const tableHeadersSale = (order?: Order, isOfflineDeal?: boolean) => {
	const productsData = order ?  order.product[order.product.length - 1] : []

	const products = productsData.map(product => ({
		id: product.productId,
		article: product.productArticle,
	}))

	return [
		{key: 'Заказчик', value: order ? isOfflineDeal ? 'Магазин' : order.name : ''},
		{key: 'Телефон', value: order ? isOfflineDeal ? 'Магазин' : order.phone : ''},
		{key: 'Адрес', value: order ? isOfflineDeal ? 'Магазин' : trimmingText(order.address, 10) : ''},
		{key: 'Доставка', value: order ? isOfflineDeal ? 'Магазин' : order.deliveryType : ''},
		{key: 'Товары', value: order ? products : []},
		{key: 'Цена', value: order ? order.totalPrice : ''},
		{key: 'Дата', value: order ? formatDateFromDb(order.createdAt) : ''},
		{key: 'Продавец', value: order ? order.author : ''},
	]
};
