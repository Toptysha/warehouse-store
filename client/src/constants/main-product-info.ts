import { Product } from "../interfaces";
import { PRODUCT } from "./product";

type Point = [string, string, keyof Product];

export const mainProductInfo = (product: Product): { point: Point }[] => {
	const productKeys = Object.keys(PRODUCT) as Array<keyof Product>;
	return [
		{ point: ['Название', product.name, productKeys[1]] },
		{ point: ['Бренд', product.brand, productKeys[3]] },
		{ point: ['Цвет', product.color, productKeys[4]] },
		{ point: ['Цена', product.price, productKeys[5]] },
	]
}
