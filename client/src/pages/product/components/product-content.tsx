import noImage from '../../../images/no_img.jpg';
import { useEffect, useState } from 'react';
import { noMeasurementsSizes, request } from '../../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Measurement, Product } from '../../../interfaces';
import styled from 'styled-components';
import { Button, Loader, PrivateContent } from '../../../components';
import { useSelector } from 'react-redux';
import { selectApp, selectUser } from '../../../redux/selectors';
import { useAppDispatch } from '../../../redux/store';
import { closeLoader, setError } from '../../../redux/reducers';
import { ACCESS, PRODUCT } from '../../../constants';
import { useDeleteProduct } from '../../../hooks';

export const ProductContent = () => {
	const params = useParams();
	const [product, setProduct] = useState<Product>(PRODUCT);
	const [covers, setCovers] = useState<string[]>([]);
	const [measurementUrls, setMeasurementUrls] = useState<Measurement[]>([]);
	const [noMeasurementSizes, setNoMeasurementSizes] = useState<string[]>([]);
	const [currentSize, setCurrentSize] = useState<string>('');

	const dispatch = useAppDispatch();

	const loader = useSelector(selectApp).loader;
	const userRole = useSelector(selectUser).roleId;

	const deleteProductHandler = useDeleteProduct(product.id);

	const navigate = useNavigate();

	useEffect(() => {
		request(`/products/${params.id}`).then(({ error, errorPath, data }) => {
			if (error) {
				dispatch(setError(errorPath === '_id' ? 'Продукт не найден' : error));
				dispatch(closeLoader());
			} else {
				setProduct(data.product);
				setCovers(data.coversUrls);
				setMeasurementUrls(data.measurementsUrls);
				setNoMeasurementSizes(() => noMeasurementsSizes(data.product.sizes, data.measurementsUrls));
				dispatch(closeLoader());
			}
		});
	}, [params.id, dispatch]);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_PRODUCTS}>
			<ProductContentContainer>
				{/* <PhotoGallery images={measurementUrls} /> */}
				<div className="main-info">
					<div className="cover">{covers !== undefined ? <img src={covers[0]} alt="Cover" /> : <img src={noImage} alt="NO COVER" />}</div>
					<div className="product-card-info">
						{ACCESS.EDIT_PRODUCTS.includes(userRole?.toString() as string) && (
							<div className="buttons">
								<Button
									description={`Редактировать товар`}
									width="190px"
									onClick={() => {
										navigate(`/catalog/${params.id}/edit`);
									}}
								/>
								<Button
									description={`Удалить товар`}
									width="130px"
									onClick={() => {
										deleteProductHandler('/catalog');
									}}
								/>
							</div>
						)}

						<p>
							Артикул: <span>{product.article}</span>
						</p>
						<p>
							Бренд: <span>{product.brand}</span>
						</p>
						<p>
							Наименование: <span>{product.name}</span>
						</p>
						<p>
							Цвет: <span>{product.color}</span>
						</p>
						<p>
							Цена: <span>{product.price}</span>
						</p>
						{product.sizes.length > 0 ? (
							<>
								<p>Размеры: </p>
								<div className="sizes">
									{product.sizes.map((size) => (
										<div key={size} className={noMeasurementSizes.includes(size) ? 'size-red' : 'size-black'} onClick={() => setCurrentSize(size)}>
											{size}
										</div>
									))}
								</div>
							</>
						) : (
							<p>
								Размеры: <span className="red-info">Нет на складе</span>
							</p>
						)}
					</div>
				</div>
				<div className="measurements">
					{measurementUrls.map((obj) => {
						if (Object.keys(obj)[0] === currentSize) {
							if (Object.values(obj).length > 0) {
								return Object.values(obj).map((urls) => (
									<div className="measurements-photos" key={urls[0]}>
										<h2>{`Замеры размера: ${currentSize}`}</h2>
										{urls.map((url) => {
											return <img src={url} alt="Measurement" key={url} />;
										})}
									</div>
								));
							}
						}
						return null;
					})}
				</div>
			</ProductContentContainer>
		</PrivateContent>
	);
};

const ProductContentContainer = styled.div`
	width: 1100px;
	margin: 0 auto;
	min-height: 900px;

	& .main-info {
		display: flex;
		justify-content: space-between;
	}

	& .cover {
		width: 500px;
		height: 400px;
	}

	& .cover img {
		border-radius: 10px;
		width: 100%;
		height: 400px;
		object-fit: cover;
		object-position: -40% 0;
	}

	& .buttons {
		// background: #aaaaaa;
		display: flex;
		margin: 0 0 15px;
	}

	& .buttons button {
		background: none;
		border: none;
		color: #d60000;
		text-decoration: underline;
	}

	& .buttons button:hover {
		text-decoration: none;
	}

	& .product-card-info {
		width: 500px;
		height: 400px;
		font-size: 28px;
	}

	& .product-card-info p {
		width: 100%;
		font-size: 22px;
		font-weight: 400;
		margin: 0px 0 5px 10px;
	}

	& .product-card-info span {
		font-size: 24px;
		font-weight: 500;
	}

	& .sizes {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		align-items: center;
		margin: 0 0 10px 10px;
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

	& .size-red,
	.red-info {
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

	& .measurements-photos {
		width: 1080px;
		margin: auto;
	}

	& .measurements-photos img {
		width: 1080px;
	}

	& .measurements-photos h2 {
		text-align: center;
	}

	& .measurements-photos img {
		border-radius: 10px;
		width: 300px;
		height: 300px;
		margin: 20px;
		object-fit: cover;
	}
`;
