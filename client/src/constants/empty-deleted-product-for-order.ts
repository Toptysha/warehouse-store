import { UpdatedProduct } from "../interfaces";

export const EMPTY_DELETED_PRODUCT_FOR_ORDER: UpdatedProduct = {
	id: 'none',
	name: 'none',
	article: 'none',
	brand: 'none',
	color: 'none',
	price: 'none',
	sizes: ['none'],
	createdAt: 'none',
	updatedAt: 'none',
	cover: 'none',
	oldPrice: 'none',
	size: 'none',
	isDeletedSize: false
}
