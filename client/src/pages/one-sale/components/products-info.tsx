import { Link } from 'react-router-dom';
import { SaleProduct, UpdatedProduct } from '../../../interfaces';
import styled from 'styled-components';
import deletedProduct from '../../../images/product_deleted.png';

export const ProductsInfo = ({ products, orderProducts }: { products: UpdatedProduct[]; orderProducts: SaleProduct[] }) => {
	const sellPriceMessage = (basePrice: string, sellPrice: string) => {
		const discount = Number(basePrice) - Number(sellPrice);
		const discountPercent = ((discount / Number(basePrice)) * 100).toFixed(2);
		return `${sellPrice}, скидка = ${discount} (${discountPercent}%) `;
	};

	return (
		<ProductsInfoContainer>
			{products.map((product, index) => {
				return product.id !== 'none' ? (
					<div key={index} className="product-card">
						<Link to={`/catalog/${product.id}`}>
							<div className="cover">
								<img src={product.cover} alt="COVER" />
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
									Базовая цена: <span>{product.oldPrice}</span>
								</p>
								<p>
									Цена продажи: <span>{sellPriceMessage(product.oldPrice, product.price)}</span>
								</p>
								<p>
									Размер: <span>{product.size}</span>
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
								Цена продажи товара была: <span className="black-style">{orderProducts[index].price}</span>
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
