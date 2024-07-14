import { request } from "./request";

export function deleteOrder(id: string) {
	request(`/orders/${id}`, 'DELETE').then(({ error, data }) => {
		if (error) {
			console.log(error);
		}
	});
}
