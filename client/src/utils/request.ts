export const request = (url: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', data?: any) => {
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: method || 'GET',
		body: data ? JSON.stringify(data) : undefined,
	}).then((response) => response.json());
};
