export interface Order {
	id: string
	name: string
	address:string
	delivery: string
	products: {
		productId: string
		size: string
		price: string
	}[]
	phone: string
	totalPrice: string
	authorId: string
	createdAt: string
	updatedAt: string
}
