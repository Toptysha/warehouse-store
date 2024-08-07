export interface SaleProduct {
	productId: string
	productArticle: string
	size: string
	price: string
	createdAt: Date
}

export interface Sale {
	id: string
	name: string
	address:string
	deliveryType: string
	deliveryPrice: string
	isExchange: boolean
	product: SaleProduct
	phone: string
	totalPrice: string
	authorId: string
	authorName?: string
	createdAt: string
	updatedAt: string
}

export interface Order extends Omit<Sale, 'product'> {
	product: SaleProduct[][]
  }
