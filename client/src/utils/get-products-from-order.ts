import noImage from '../images/no_img.jpg';
import { SaleProduct, UpdatedProduct } from "../interfaces";
import { request } from "./request";

export const getProductsFromOrder = async (orderProducts: SaleProduct[]) => {

	try {
		const productPromises = orderProducts.map((order) => request(`/products/${order?.productId}`));

		const responses = await Promise.all(productPromises as Promise<any>[]);

		const fetchedProducts: UpdatedProduct[] = [];

		responses.forEach(({ error, data }, index) => {
			if (error) {
				console.log(error);
			} else {
				fetchedProducts.push({
					...data.product,
					cover: data.coversUrls[0] ? data.coversUrls[0] : noImage,
					isDeletedSize: false,
					price: orderProducts[index].price,
					oldPrice: data.product.price,
					size: orderProducts[index].size,
				});
			}
		});

		return {data: fetchedProducts};
	} catch (error) {
		return {error}
	}

};
