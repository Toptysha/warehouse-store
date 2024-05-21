import { PHOTO_TYPES } from "../constants";
import { PhotoType } from "../interfaces";

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

		console.log(id, typePhotos, selectedFiles, currentSize)
		formData.forEach((value, key) => {
			console.log(key, value);
		});

		return await fetch('/products/photos', {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.catch((error) => {
				console.log('Error:', error);
			});
}
