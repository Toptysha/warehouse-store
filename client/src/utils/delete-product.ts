import { request } from "./request";

export function deleteProduct(id: string) {
	request(`/products/${id}`, 'DELETE').then(({ error, data }) => {
		if (error) {
			console.log(error);
		}
	});
}
