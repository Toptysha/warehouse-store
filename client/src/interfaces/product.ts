export interface Product {
	id: string,
	name: string,
	article: string,
	brand: string,
	color: string,
	price: string,
	sizes: string[],
	createdAt: string,
	updatedAt: string
}

export interface UpdatedProduct extends Product {
	cover: string;
	oldPrice: string;
	size: string;
	isDeletedSize: boolean;
}
