import { mainProductInfo } from "../constants";
import { Product } from "../interfaces";
import { request } from "./request";

export const changeProductInfo = async (key: string, changeParam: string, product: Product, selectedSizes:string[], currentPoint:Record<string, string> ) => {

	let endProduct = {};

	if (changeParam === 'sizes') {
		endProduct = { sizes: selectedSizes };
	} else {
		const updatedProduct = mainProductInfo(product).map(({ point }) => {
			const pointKey = point[2];
			if (changeParam === pointKey) {
				return { [pointKey]: currentPoint[key] };
			}
			return { [pointKey]: point[1] };
		});

		endProduct = updatedProduct.reduce((acc, obj) => {
			return { ...acc, ...obj };
		});
	}

	return await request(`/products/${product.id}`, 'PATCH', endProduct)
};
