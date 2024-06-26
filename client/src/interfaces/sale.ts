interface SaleProduct {
	productId: string
	productArticle: string
	size: string
	price: string
}

export interface Sale {
	id: string
	name: string
	address:string
	deliveryType: string
	deliveryPrice: string
	product: SaleProduct
	phone: string
	totalPrice: string
	authorId: string
	createdAt: string
	updatedAt: string
}

export interface Order extends Omit<Sale, 'product'> {
	product: SaleProduct[];
  }
