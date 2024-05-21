import { DataDeletePhoto, PhotoType } from "../interfaces";
import { request } from "./request";

export const deletePhoto = (photoUrl: string) => {
	let data: DataDeletePhoto = {
		fileName: '',
		sizeName: '',
		typeOfPhoto: '' as PhotoType,
		id: '',
	};

	const arrOfUrl = photoUrl.split('/');

	if (arrOfUrl.length === 8) {
		data.fileName = arrOfUrl[7];
		data.sizeName = arrOfUrl[6];
		data.typeOfPhoto = arrOfUrl[5] as PhotoType;
		data.id = arrOfUrl[4];
	} else if (arrOfUrl.length === 7) {
		data.fileName = arrOfUrl[6];
		data.typeOfPhoto = arrOfUrl[5] as PhotoType;
		data.id = arrOfUrl[4];
	}
	console.log(data);

	request(`/products/delete-photo`, 'POST', data).then(({ error, data }) => {
		if (error) {
			console.log(error);
		}
		console.log(data);
	});
};
