export interface Sale {
	id: string
	name: string
	address:string
	delivery: string
	product: {
		productId: string
		size: string
		price: string
	}
	phone: string
	totalPrice: string
	authorId: string
	createdAt: string
	updatedAt: string
}
