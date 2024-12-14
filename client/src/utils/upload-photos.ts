import { PHOTO_TYPES } from "../constants";
import { PhotoType } from "../interfaces";
import { request } from "./request";

export const uploadPhotos = async (id: string, typePhotos: PhotoType, selectedFiles: File[], currentSize?: string) => {
		const formData = new FormData();

		selectedFiles.forEach((file) => {
			formData.append('files', file);
		});
		formData.append('folder', id);
		formData.append('typePhotos', typePhotos);
		if (typePhotos === PHOTO_TYPES.MEASUREMENTS) {
			formData.append('currentSize', currentSize as string);
		}

		return await request('/products/photos', 'POST', formData, true)
			.then((response) => response.json())
			.catch((error) => {
				console.log(error);
			});
}
