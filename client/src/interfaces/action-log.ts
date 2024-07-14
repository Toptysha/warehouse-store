interface Product {
	id: string,
	isChangedCovers?: boolean,
	isChangedMeasurements?: boolean,
	changedMeasurementsSize?: string,
	article?: string,
	brandOld?: string,
	nameOld?: string,
	colorOld?: string,
	priceOld?: string,
	sizesOld?: string[],
	brandNew?: string,
	nameNew?: string,
	colorNew?: string,
	priceNew?: string,
	sizesNew?: string[],
  }

interface Order {
	id: string,
	nameOld?: string,
	phoneOld?: string,
	addressOld?: string,
	deliveryTypeOld?: string,
	deliveryPriceOld?: string,
	productsOld?: {id: string, article: string}[],
	nameNew?: string,
	phoneNew?: string,
	addressNew?: string,
	deliveryTypeNew?: string,
	deliveryPriceNew?: string,
	productsNew?: {id: string, article: string}[],
  }

interface User {
	id: string,
	roleOld?: string,
	roleNew?: string,
  }

export interface ActionLog {
	id: string,
    author: string,
    action: string,
	createdAt: string,
    product?: Product,
    order?: Order,
    user?: User,
  }
