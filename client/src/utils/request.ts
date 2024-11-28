export const request = (url: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', data?: any) => {
	// return fetch(`http://localhost:3000${url}`, {
	return fetch(`https://server.warehouse-store.online${url}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
	}).then((response) => response.json());
};
