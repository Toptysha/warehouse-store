import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthFormError, Button, Input, PrivateContent, UploadPhotos } from '../../../components';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { createArticle, request } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { ACCESS, PHOTO_TYPES, SIZES } from '../../../constants';
import { PhotoType } from '../../../interfaces';

const regFormScheme = yup.object().shape({
	brand: yup.string().required('Заполните бренд'),
	name: yup.string().required('Заполните наименование'),
	color: yup.string().required('Заполните цвет'),
	price: yup
		.string()
		.required('Заполните цену')
		.matches(/^[0-9]+$/, 'В цене должны быть указаны только цифры'),
});

interface SelectedMeasurements {
	size: string;
	files: File[];
}

export const ProductCreate = () => {
	const [selectedCovers, setSelectedCovers] = useState<File[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
	const [currentSize, setCurrentSize] = useState<string>('');
	const [selectedMeasurements, setSelectedMeasurements] = useState<File[]>([]);
	const [selectedAllMeasurements, setSelectedAllMeasurements] = useState<SelectedMeasurements[]>([]);

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			brand: '',
			name: '',
			color: '',
			price: '',
		},
		resolver: yupResolver(regFormScheme),
	});

	useEffect(() => {
		if (currentSize !== '') {
			const isEdit = selectedAllMeasurements.flatMap((obj) => [obj.size]).includes(currentSize);
			let updatedSelectedAllMeasurements: SelectedMeasurements[] = [];
			if (isEdit) {
				updatedSelectedAllMeasurements = selectedAllMeasurements.map((obj) => {
					if (obj.size === currentSize) {
						return { size: currentSize, files: selectedMeasurements };
					}
					return obj;
				});
				setSelectedAllMeasurements(updatedSelectedAllMeasurements);
			} else {
				setSelectedAllMeasurements([...selectedAllMeasurements, { size: currentSize, files: selectedMeasurements }]);
			}
		}

		if (selectedMeasurements.length > 0) {
			setSelectedMeasurements([]);
			setCurrentSize('');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMeasurements]);

	const [serverError, setServerError] = useState('');

	const onSubmit = ({ brand, name, color, price }: { brand: string; name: string; color: string; price: string }) => {
		const article = createArticle();

		request('/products', 'POST', { article, brand, name, color, price, sizes: selectedSizes }).then(({ error, data }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			uploadMeasurements(data.id);
			uploadCovers(data.id).then(() => navigate('/catalog'));
		});
	};

	async function uploadCovers(folderName: string) {
		if (selectedCovers.length === 0) {
			return;
		}

		await uploadPhotos(folderName, selectedCovers, PHOTO_TYPES.COVER);
	}

	async function uploadPhotos(folderName: string, files: File[], photoType: PhotoType, size?: string) {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('files', file);
		});
		formData.append('folder', folderName);
		formData.append('typePhotos', photoType);
		if (size) {
			formData.append('currentSize', size);
		}

		return await fetch('/products/photos', {
			method: 'POST',
			body: formData,
		}).then((response) => response.json());
	}

	async function uploadMeasurements(folderName: string) {
		if (selectedAllMeasurements.length === 0) {
			return;
		}

		selectedAllMeasurements.forEach(async (obj) => {
			await uploadPhotos(folderName, obj.files, PHOTO_TYPES.MEASUREMENTS, obj.size);
		});
	}

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setCurrentSize(value);
		setSelectedSizes((prevSelectedSizes) => {
			if (prevSelectedSizes.includes(value)) {
				return prevSelectedSizes.filter((option) => option !== value);
			} else {
				return [...prevSelectedSizes, value];
			}
		});
	};

	const formError = errors?.brand?.message || errors?.name?.message || errors?.color?.message || errors?.price?.message;
	const errorMessage = formError || serverError;

	const MeasurementsFiles = () => {
		const removeMeasurement = (index: number) => {
			setSelectedAllMeasurements((prevSelectedMeasurements) => {
				return prevSelectedMeasurements.filter((_, i) => i !== index);
			});
		};
		return (
			<div className="measurements-files">
				{selectedAllMeasurements.map(({ size, files }, index) => {
					return (
						<div key={size} className="measurements-files-block">
							<p>{`Замеры ${size} размера:`}</p>
							<div className="files">
								{files.map((file) => {
									return <p key={file.name}>{file.name}</p>;
								})}
							</div>
							<Button
								description="Удалить"
								onClick={() => {
									removeMeasurement(index);
								}}
							/>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<PrivateContent access={ACCESS.EDIT_PRODUCTS}>
			<ProductCreateContainer>
				<form onSubmit={handleSubmit(onSubmit)}>
					<h3>Бренд:</h3>
					<Input placeholder="Бренд" width="300px" {...register('brand', { onChange: () => setServerError('') })} />
					<h3>Наименование:</h3>
					<Input placeholder="Наименование" width="300px" {...register('name', { onChange: () => setServerError('') })} />
					<h3>Цвет:</h3>
					<Input placeholder="Цвет" width="300px" {...register('color', { onChange: () => setServerError('') })} />
					<h3>Цена:</h3>
					<Input type="number" placeholder="Цена" width="300px" {...register('price', { onChange: () => setServerError('') })} />
					<h3>Выберите Размеры:</h3>
					<p>(если не указать размеры, будет считаться, что товар отсутствует)</p>
					<div className="sizes">
						{SIZES.map((size, index) => (
							<div key={index} className="checkbox-sizes">
								<label>
									<input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={handleOptionChange} />
									{size}
								</label>
							</div>
						))}
					</div>
					{currentSize && (
						<UploadPhotos
							selectedFiles={selectedMeasurements}
							setSelectedFiles={setSelectedMeasurements}
							typeOfSelectedFiles={PHOTO_TYPES.MEASUREMENTS as PhotoType}
							description={`Добавить замеры ${currentSize} размера`}
							width="290px"
							$labelLeft="10px"
							$marginContainer="40px 0"
						/>
					)}
					{selectedAllMeasurements.length > 0 ? <MeasurementsFiles /> : null}
					<UploadPhotos
						selectedFiles={selectedCovers}
						setSelectedFiles={setSelectedCovers}
						typeOfSelectedFiles={PHOTO_TYPES.COVER as PhotoType}
						description="Загрузить обложки"
						width="190px"
						$labelLeft="60px"
						$marginContainer="40px 0"
					/>
					<Button className="reg-button" description="Создать товар" type="submit" disabled={!!formError} />
					{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
				</form>
			</ProductCreateContainer>
		</PrivateContent>
	);
};

const ProductCreateContainer = styled.div`
	// background-color: #fff;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	width: 600px;
	margin: 0 auto;
	padding-top: 25px;
	min-height: 900px;

	& form {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 550px;
		max-width: 600px;
		margin: 0 auto;
		padding: 0 20px;
	}

	& h3 {
		margin: 20px 0 0;
	}

	& .checkbox-sizes {
		margin: 10px 0;
		width: 100px;
	}

	& .sizes {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 20px 0 40px;
	}

	& .sizes label {
		margin: 10px;
	}

	& .sizes label input {
		margin: 5px;
	}

	& .measurements-files {
		background: #e2e2e2;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin: 20px 0;
		padding: 5px;
		font-size: 14px;
		max-height: 150px;
		overflow-y: auto;
	}

	& .measurements-files-block {
		background: #fff;
		width: 100%;
		margin: 10px;
		padding: 10px;
		border-radius: 5px;
	}

	& .measurements-files-block > p {
		font-size: 14px;
		font-weight: bold;
	}

	& .measurements-files-block button {
		width: 120px;
		font-size: 14px;
		background: none;
		border: none;
		margin-left: 170px;
		text-decoration: underline;
	}

	& .measurements-files-block button:hover {
		text-decoration: none;
	}

	& .reg-button {
		margin: 20px;
		width: 170px;
	}
`;
