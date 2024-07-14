import { Link } from 'react-router-dom';
import { SaleProduct, UpdatedProduct } from '../../../interfaces';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import deletedProduct from '../../../images/product_deleted.png';

export const ProductsInfo = ({ products, orderProducts }: { products: UpdatedProduct[]; orderProducts: SaleProduct[] }) => {
	const [productIndexes, setProductIndexes] = useState<number[]>([]);

	const sellPriceMessage = (basePrice: string, sellPrice: string) => {
		const discount = Number(basePrice) - Number(sellPrice);
		const discountPercent = ((discount / Number(basePrice)) * 100).toFixed(2);
		return `${sellPrice}, скидка = ${discount} (${discountPercent}%) `;
	};

	useEffect(() => {
		let i = 0;
		let plusIndexes: number[] = [];
		orderProducts.forEach(({ productId }, index) => {
			if (productId === products[index - i]?.id) {
				plusIndexes.push(i);
			} else {
				i++;
				plusIndexes.push(i);
			}
		});
		setProductIndexes(plusIndexes);
	}, [products, orderProducts]);

	return (
		<ProductsInfoContainer>
			{orderProducts.map((product, index) => {
				return products[index - productIndexes[index]]?.id === product.productId ? (
					<div key={index} className="product-card">
						<Link to={`/catalog/${products[index - productIndexes[index]].id}`}>
							<div className="cover">
								<img src={products[index - productIndexes[index]].cover} alt="COVER" />
							</div>
							<div className="product-info">
								<p>
									Артикул: <span>{products[index - productIndexes[index]].article}</span>
								</p>
								<p>
									Бренд: <span>{products[index - productIndexes[index]].brand}</span>
								</p>
								<p>
									Наименование: <span>{products[index - productIndexes[index]].name}</span>
								</p>
								<p>
									Цвет: <span>{products[index - productIndexes[index]].color}</span>
								</p>
								<p>
									Базовая цена: <span>{products[index - productIndexes[index]].oldPrice}</span>
								</p>
								<p>
									Цена продажи: <span>{sellPriceMessage(products[index - productIndexes[index]].oldPrice, products[index - productIndexes[index]].price)}</span>
								</p>
								<p>
									Размер: <span>{products[index - productIndexes[index]].size}</span>
								</p>
							</div>
						</Link>
					</div>
				) : (
					<div key={index} className="product-card">
						<div className="deleted-cover">
							<img src={deletedProduct} alt="COVER" />
						</div>
						<div className="product-info">
							<p className="red-style">
								<span>Товар был удалён</span>
								<br />
								Цена продажи товара была: <span className="black-style">{product.price}</span>
							</p>
						</div>
					</div>
				);
			})}
		</ProductsInfoContainer>
	);
};

const ProductsInfoContainer = styled.div`
	// background-color: #fff;
	width: 500px;

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

	& .deleted-cover {
		width: 300px;
		margin: 20px auto 10px;
	}

	& .deleted-cover img {
		width: 100%;
	}

	& .red-style {
		text-align: center;
		color: #b00;
	}

	& .black-style {
		color: #000;
	}
`;
