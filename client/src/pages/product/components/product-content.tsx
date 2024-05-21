import noImage from '../../../images/no_img.jpg';
import { useEffect, useState } from 'react';
import { noMeasurementsSizes, request } from '../../../utils';
import { useParams } from 'react-router-dom';
import { Measurement, Product } from '../../../interfaces';
import styled from 'styled-components';

export const ProductContent = () => {
	const params = useParams();
	const [product, setProduct] = useState<Product>({ id: '', name: '', article: '', brand: '', color: '', price: '', sizes: [], createdAt: '', updatedAt: '' });
	const [covers, setCovers] = useState<string[]>([]);
	const [measurementUrls, setMeasurementUrls] = useState<Measurement[]>([]);
	const [noMeasurementSizes, setNoMeasurementSizes] = useState<string[]>([]);
	const [currentSize, setCurrentSize] = useState<string>('');

	// const testSizes = ['42', '44', '46', '48-min', '48-max', '50', '52', '54'];
	// const testSizes2: Measurement[] = [{ S: ['SS1', 'SS1', 'SS1'] }, { M: ['MM1', 'MM1', 'MM1'] }, { L: ['LL1', 'LL1', 'LL1'] }];

	useEffect(() => {
		request(`/products/${params.id}`).then(({ error, data }) => {
			if (error) {
				console.log(error);
			}
			// console.log(data);
			setProduct(data.product);
			setCovers(data.coversUrls);
			setMeasurementUrls(data.measurementsUrls);
			setNoMeasurementSizes(() => noMeasurementsSizes(data.product.sizes, data.measurementsUrls));
		});
	}, [params.id]);

	return (
		<ProductContentContainer>
			{/* <PhotoGallery images={measurementUrls} /> */}
			<div className="main-info">
				<div className="cover">{covers !== undefined ? <img src={covers[0]} alt="Cover" /> : <img src={noImage} alt="NO COVER" />}</div>
				<div className="product-card-info">
					<p>{`Артикул: ${product.article}`}</p>
					<p>{`Бренд: ${product.brand}`}</p>
					<p>{`Наименование: ${product.name}`}</p>
					<p>{`Цвет: ${product.color}`}</p>
					<p>{`Цена: ${product.price}`}</p>
					<p>{`Размеры: `}</p>
					{product.sizes.includes('Нет в наличии') ? (
						<div className="not-available">Нет в наличии</div>
					) : (
						<div className="sizes">
							{product.sizes.map((size) => (
								<div key={size} className={noMeasurementSizes.includes(size) ? 'size-red' : 'size-black'} onClick={() => setCurrentSize(size)}>
									{size}
								</div>
							))}
						</div>
					)}
					{}
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
	);
};

const ProductContentContainer = styled.div`
	width: 1100px;
	margin: 60px auto 0;
	padding-top: 25px;
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

	& .product-card-info {
		width: 500px;
		height: 400px;
		font-size: 28px;
	}

	& .product-card-info p {
		margin-bottom: 10px;
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
