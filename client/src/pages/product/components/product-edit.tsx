import { useEffect, useState } from 'react';
import { changeProductInfo, noMeasurementsSizes, request, uploadPhotos } from '../../../utils';
import { useParams } from 'react-router-dom';
import { PhotoType, Measurement, Product } from '../../../interfaces';
import styled from 'styled-components';
import { Button, FillAllPhotos, Input, Loader, PrivateContent, UploadPhotos } from '../../../components';
import { PHOTO_TYPES, PRODUCT, SIZES, ACCESS, mainProductInfo } from '../../../constants';
import { useDeleteProduct } from '../../../hooks';
import { useSelector } from 'react-redux';
import { selectApp } from '../../../redux/selectors';
import { useAppDispatch } from '../../../redux/store';
import { closeLoader, setError } from '../../../redux/reducers';

export const ProductEdit = () => {
	const [product, setProduct] = useState<Product>(PRODUCT);
	const [coverUrls, setCoverUrls] = useState<string[]>([]);
	const [measurementUrls, setMeasurementUrls] = useState<Measurement[]>([]);
	const [noMeasurementSizes, setNoMeasurementSizes] = useState<string[]>([]);
	const [currentSize, setCurrentSize] = useState<string>('');
	const [selectedSizes, setSelectedSizes] = useState<string[]>(product.sizes);
	const [showSizes, setShowSizes] = useState<boolean>(false);
	const [editingPoint, setEditingPoint] = useState<string | null>(null);
	const [currentPoint, setCurrentPoint] = useState<Record<string, string>>({});
	const [isPageRefresh, setIsPageRefresh] = useState<boolean>(false);
	const [selectedCoverFiles, setSelectedCoverFiles] = useState<File[]>([]);
	const [selectedMeasurementsFiles, setSelectedMeasurementsFiles] = useState<File[]>([]);

	const dispatch = useAppDispatch();

	const deleteProductHandler = useDeleteProduct(product.id);

	const loader = useSelector(selectApp).loader;

	const params = useParams();

	useEffect(() => {
		request(`/products/${params.id}`).then(({ error, errorPath, data }) => {
			if (error) {
				dispatch(setError(errorPath === 'id' ? 'Продукт не найден' : error));
				dispatch(closeLoader());
			} else {
				setProduct(data.product);
				setCoverUrls(data.coversUrls);
				setMeasurementUrls(data.measurementsUrls);
				setNoMeasurementSizes(() => noMeasurementsSizes(data.product.sizes, data.measurementsUrls));
				dispatch(closeLoader());
			}
		});
	}, [params.id, isPageRefresh, dispatch]);

	useEffect(() => {
		setSelectedSizes(product.sizes);
	}, [product.sizes]);

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setSelectedSizes((prevSelectedSizes) => {
			if (prevSelectedSizes.includes(value)) {
				return prevSelectedSizes.filter((option) => option !== value);
			} else {
				return [...prevSelectedSizes, value];
			}
		});
	};

	const handleEditClick = (key: string, initState: string) => {
		setEditingPoint(key);
		setCurrentPoint((prev) => ({
			...prev,
			[key]: prev[key] || initState,
		}));
	};

	const handleSaveInfo = async (key: string, changeParam: string) => {
		setEditingPoint(null);
		await changeProductInfo(key, changeParam, product, selectedSizes, currentPoint).then(({ error, data }) => {
			if (error) {
				console.log(error);
			}
			setIsPageRefresh(!isPageRefresh);
		});
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, key: string, changeParam: string) => {
		if (event.key === 'Enter') {
			handleSaveInfo(key, changeParam);
		}
	};

	const handleSavePhotos = async (typePhotos: PhotoType) => {
		await uploadPhotos(params.id as string, typePhotos, typePhotos === PHOTO_TYPES.COVER ? selectedCoverFiles : selectedMeasurementsFiles, currentSize).then((data) => {
			setIsPageRefresh(!isPageRefresh);
			setSelectedCoverFiles([]);
			setSelectedMeasurementsFiles([]);
		});
	};

	const handleChange = (key: string, value: string) => {
		setCurrentPoint((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const onChangeCurrentSize = (size: string) => {
		setCurrentSize(size);
		setSelectedCoverFiles([]);
		setSelectedMeasurementsFiles([]);
	};

	const coloredSizes = (size: string) => {
		let check = false;

		if (!noMeasurementSizes.includes(size)) {
			measurementUrls.forEach((obj) => {
				if (Object.keys(obj)[0] === size) {
					if (Object.values(obj).length > 0) {
						Object.values(obj).forEach((urls) => {
							if (urls.length > 0) {
								check = true;
							}
						});
					}
				}
			});
		}
		return check;
	};

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.EDIT_PRODUCTS}>
			<ProductEditContainer>
				<div className="main-info">
					<div className="photos-container">
						<UploadPhotos
							selectedFiles={selectedCoverFiles}
							setSelectedFiles={setSelectedCoverFiles}
							typeOfSelectedFiles={PHOTO_TYPES.COVER as PhotoType}
							description="Добавить обложки"
							saveButtonDescription={`Отправить обложки на сервер`}
							handleSavePhotos={() => handleSavePhotos(PHOTO_TYPES.COVER as PhotoType)}
							width="190px"
							$marginContainer="40px 0"
						/>
						<FillAllPhotos limit={6} photoUrls={coverUrls} isPageRefresh={isPageRefresh} setIsPageRefresh={setIsPageRefresh} />
					</div>
					<div className="product-card-info">
						<div className="delete-product">
							<Button
								description={`Удалить товар`}
								onClick={() => {
									deleteProductHandler('/catalog');
								}}
							/>
						</div>
						<p>{`Артикул: ${product.article}`}</p>
						{mainProductInfo(product).map(({ point }) => (
							<div key={point[0]} className="info-point">
								<p key={point[0]}>
									{point[0]}:{' '}
									{editingPoint === point[0] ? (
										<Input
											type={point[0] === 'Цена' ? 'number' : 'text'}
											value={currentPoint[point[0]]}
											placeholder={`Введите ${point[0]}...`}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(point[0], event.target.value)}
											onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event, point[0], point[2])}
											onBlur={() => handleSaveInfo(point[0], point[2])}
										/>
									) : (
										<span>{point[1]}</span>
									)}
								</p>
								<Button description="🖊️ред." onClick={() => handleEditClick(point[0], point[1])} />
							</div>
						))}
						<div className="size-range">
							<p>{`Размеры: `}</p>
							<Button description="Изменить размерный ряд" onClick={() => setShowSizes(!showSizes)} />
						</div>
						<div className="size-range-container" style={{ display: `${showSizes ? 'block' : 'none'}` }}>
							<div className="sizes-change">
								{SIZES.map((size, index) => (
									<div key={index} className="checkbox-sizes">
										<label>
											<input type="checkbox" value={size} checked={selectedSizes.includes(size)} onChange={handleOptionChange} />
											{size}
										</label>
									</div>
								))}
							</div>
							<Button description="Сохранить размерный ряд" onClick={() => handleSaveInfo('Размеры', 'sizes')} />
						</div>
						{product.sizes.length === 0 ? (
							<div className="not-available">Нет на складе</div>
						) : (
							<div className="sizes">
								{product.sizes.map((size) => (
									<div
										key={size}
										className={coloredSizes(size) ? 'size-black' : 'size-red'}
										onClick={() => {
											onChangeCurrentSize(size);
										}}
									>
										{size}
									</div>
								))}
							</div>
						)}
						<div className="photos-container">
							{currentSize && (
								<UploadPhotos
									selectedFiles={selectedMeasurementsFiles}
									setSelectedFiles={setSelectedMeasurementsFiles}
									typeOfSelectedFiles={PHOTO_TYPES.MEASUREMENTS as PhotoType}
									description={`Добавить замеры ${currentSize}`}
									saveButtonDescription={`Отправить замеры ${currentSize} на сервер`}
									handleSavePhotos={() => handleSavePhotos(PHOTO_TYPES.MEASUREMENTS as PhotoType)}
									width="245px"
									$labelLeft="60px"
									$marginContainer="40px 0"
									$marginLabel="100px 75px"
								/>
							)}
							{measurementUrls.map((obj) => {
								if (Object.keys(obj)[0] === currentSize) {
									if (Object.values(obj).length > 0) {
										return Object.values(obj).map((urls) =>
											coloredSizes(currentSize) ? (
												<div className="measurements-container" key={urls[0]}>
													<h2>{`Замеры размера: ${currentSize}`}</h2>
													<FillAllPhotos limit={10} photoUrls={urls} isPageRefresh={isPageRefresh} setIsPageRefresh={setIsPageRefresh} />
												</div>
											) : null,
										);
									}
								}
								return null;
							})}
						</div>
					</div>
				</div>
			</ProductEditContainer>
		</PrivateContent>
	);
};

const ProductEditContainer = styled.div`
	width: 1100px;
	margin: 0 auto;
	padding-top: 25px;
	min-height: 2050px;

	& .main-info {
		display: flex;
		justify-content: space-between;
	}

	& .photos-container {
		// background-color: #ffffff;
		width: 530px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 100%));
		gap: 10px;
	}

	& .photos-container label {
		font-size: 18px;
	}

	& .product-card-info {
		width: 500px;
		height: 400px;
		font-size: 28px;
	}

	& .delete-product {
		// background: #aaaaaa;
		display: flex;
	}

	& .delete-product button {
		background: none;
		width: 150px;
		border: none;
		color: #d60000;
		text-decoration: underline;
	}

	& .delete-product button:hover {
		text-decoration: none;
	}

	& .info-point {
		// background: green;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	& .info-point p {
		// background: red;
		margin-top: 10px;
		width: 85%;
	}

	& .info-point input {
		margin: 0 0 0 10px;
		width: 150px;
		height: 25px;
	}

	& .info-point button {
		// background: yellow;
		background: none;
		width: 80px;
		border: none;
		margin: 0 10px;
		text-decoration: underline;
	}

	& .info-point button:hover {
		text-decoration: none;
	}

	& .size-range {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	& .size-range button {
		background: rgba(0, 0, 0, 0);
		padding: 5px;
		border: none;
		text-decoration: underline;
	}

	& .size-range button:hover {
		text-decoration: none;
	}

	& .size-range-container {
		// background-color: red;
		display: flex;
		justify-content: center;
		width: 100%;
	}

	& .size-range-container button {
		background: #f0f0f0;
		width: 250px;
		margin: 0 0 30px calc(50% - 250px / 2);
	}

	& .size-range-container button:hover {
		background: #ffffff;
		transition: 0.3s;
	}

	& .sizes-change {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 20px 0 40px;
	}

	& .sizes-change label {
		margin: 10px;
	}

	& .sizes-change label input {
		margin: 5px;
	}

	& .sizes {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 10px;
		border-radius: 5px;
		border: 1px solid black;
		padding: 5px;
	}

	& .size-black,
	.size-red {
		cursor: pointer;
		width: 99px;
		margin-bottom: 10px;
		text-align: center;
		text-decoration: underline;
	}

	& .size-black:hover,
	.size-red:hover {
		text-decoration: none;
	}

	& .size-red,
	.not-available {
		color: #d60000;
	}

	& .size-black img {
		position: absolute;
		width: 200px;
	}

	& .measurements {
		background-color: white;
		border-radius: 10px;
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 100%));
		gap: 10px;
	}

	& .measurements-container h2 {
		text-align: center;
		font-size: 28px;
		font-weight: normal;
	}

	& .measurements-container > button {
		background: #f0f0f0;
		width: 200px;
		margin: 20px 0 20px calc(50% - 200px / 2);
	}

	& .measurements-photos img {
		border-radius: 10px;
		width: 320px;
		margin: 20px;
		object-fit: cover;
	}
`;
