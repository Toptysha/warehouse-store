import { MAIN_DATA } from "../prod-dev-data";

export const request = (
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: any,
    isFile?: boolean
) => {
    return fetch(`${MAIN_DATA.server}${url}`, {
        headers: isFile
            ? undefined // Если это файл, заголовки устанавливаются автоматически
            : {
                  'Content-Type': 'application/json',
              },
        credentials: 'include',
        method: method || 'GET',
        body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    }).then((response) => {
        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
};
