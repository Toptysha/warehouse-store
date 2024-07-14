import { UpdatedProduct } from "../interfaces";
import { request } from "./request";

export const removeSizes = async (products: UpdatedProduct[]) => {
	const updatePromises = products.map((product) => {
		if (product.isDeletedSize) {
			const newSizes = product.sizes.filter((deletedSize) => deletedSize !== product.size);
			return request(`/products/${product.id}`, 'PATCH', {sizes: newSizes });
		}
		return Promise.resolve();
	});

	await Promise.all(updatePromises);
}
