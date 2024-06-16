import noImage from '../../../images/no_img.jpg';
import styled from 'styled-components';
import { Product, Sale } from '../../../interfaces';
import { formatDateFromDb, request } from '../../../utils';
import { useEffect, useState } from 'react';
import { OFFLINE_DEAL } from '../../../constants';
import { Link } from 'react-router-dom';

export const OneSale = ({ sale }: { sale: Sale[] }) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [coverUrls, setCoverUrls] = useState<string[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const productPromises = sale.map((order) => request(`/products/${order.product.productId}`));

				const responses = await Promise.all(productPromises);

				const fetchedProducts: Product[] = [];
				const fetchedCoverUrls: string[] = [];

				responses.forEach(({ error, data }) => {
					if (error) {
						console.log(error);
					} else {
						fetchedProducts.push(data.product);
						fetchedCoverUrls.push(data.coversUrls[0] ? data.coversUrls[0] : noImage);
					}
				});

				setProducts(fetchedProducts);
				setCoverUrls(fetchedCoverUrls);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};

		fetchProducts();
	}, [sale]);

	const isOfflineSale = sale[0].address === OFFLINE_DEAL && sale[0].deliveryType === OFFLINE_DEAL;

	const sellPriceMessage = (basePrice: string, sellPrice: string) => {
		const discount = Number(basePrice) - Number(sellPrice);
		const discountPercent = ((discount / Number(basePrice)) * 100).toFixed(2);
		return `${sellPrice}, скидка = ${discount} (${discountPercent}%) `;
	};

	return (
		<OneSaleContainer $height={isOfflineSale ? '110px' : '330px'}>
			<div className="title">
				<h2>{isOfflineSale ? 'Продажа из магазина:' : 'Онлайн продажа:'}</h2>
			</div>
			<div className="main-info">
				<div className="order-info">
					{!isOfflineSale && (
						<>
							<p>
								Заказчик: <span>{sale[0].name}</span>
							</p>
							<p>
								Телефон: <span>{sale[0].phone}</span>
							</p>
							<p>
								Адрес доставки: <span>{sale[0].address}</span>
							</p>
							<p>
								Служба доставки: <span>{sale[0].deliveryType}</span>
							</p>
							<p>
								Стоимость доставки: <span>{sale[0].deliveryPrice}</span>
							</p>
						</>
					)}
					<p>
						Стоимость товаров: <span>{Number(sale[0].totalPrice) - Number(sale[0].deliveryPrice)}</span>
					</p>
					<p>
						Дата: <span>{formatDateFromDb(sale[0].createdAt)}</span>
					</p>
					<p>
						Продавец: <span>{sale[0].authorId}</span>
					</p>
				</div>
				<div className="products">
					{products.map((product, index) => (
						<div key={product.id} className="product-card">
							<Link to={`/catalog/${product.id}`}>
								<div className="cover">
									<img src={coverUrls[index]} alt="COVER" />
								</div>
								<div className="product-info">
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
										Базовая цена: <span>{product.price}</span>
									</p>
									<p>
										Цена продажи: <span>{sellPriceMessage(product.price, sale[index].product.price)}</span>
									</p>
									<p>
										Размер: <span>{sale[index].product.size}</span>
									</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</OneSaleContainer>
	);
};

const OneSaleContainer = styled.div<{ $height?: string }>`
	width: 1100px;
	margin: 0 auto;

	& .title {
		// background-color: #fff;
		width: 100%;
		margin: 0 0 30px 10px;
		text-align: center;
	}

	& .main-info {
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
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
	}

	& .order-info {
		// background-color: #fff;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		text-align: left;
		width: 500px;
		height: ${({ $height = '270px' }) => $height};
		border-radius: 10px;
		border: 1px solid #000;
	}

	& .product-info {
		// background-color: #fff;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		text-align: left;
		width: 500px;
		height: 290px;
	}

	& .order-info p,
	.product-info p {
		width: 100%;
		font-size: 20px;
		font-weight: 400;
		margin: 0px 0 0 10px;
	}

	& .order-info span,
	.product-info span {
		font-size: 22px;
		font-weight: 500;
	}

	& .product-card {
		border-radius: 10px;
		border: 1px solid #000;
		margin: 0 0 20px;
	}

	& .product-card a {
		text-decoration: none;
		color: #000;
	}
`;
