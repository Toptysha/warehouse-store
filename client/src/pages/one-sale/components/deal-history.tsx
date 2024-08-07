import styled from 'styled-components';
import { Order, UpdatedProduct } from '../../../interfaces';
import { ProductsInfo } from './products-info';
import { useEffect, useState } from 'react';
import { getProductsFromOrder } from '../../../utils';
import { Button } from '../../../components';

export const DealHistory = ({ order }: { order: Order }) => {
	const [arrOfProducts, setArrOfProducts] = useState<UpdatedProduct[][]>([]);
	const [isShowHistory, setIsShowHistory] = useState<boolean>(false);

	useEffect(() => {
		const fetchProducts = async () => {
			const allProducts: UpdatedProduct[][] = [];

			for (const productGroup of order.product) {
				try {
					const { data, error } = await getProductsFromOrder(productGroup);
					if (error) {
						console.log(error);
					} else if (data) {
						allProducts.push(data);
					}
				} catch (error) {
					console.error('Error fetching products:', error);
				}
			}
			setArrOfProducts(allProducts);
		};

		fetchProducts();
	}, [order.product]);

	const orderProductReverse = [...order.product].reverse();

	return (
		<DealHistoryContainer>
			<div className="buttons">
				<Button
					description={`Показать историю изменений`}
					width="240px"
					onClick={() => {
						setIsShowHistory(!isShowHistory);
					}}
				/>
			</div>
			{isShowHistory && (
				<div className="products-history">
					{arrOfProducts.reverse().map((products, index) => {
						if (index !== 0) {
							if (products.length === 0) {
								return (
									<div key={index}>
										<p className={`${index === 1 ? 'arrow-down cancel-margin' : 'arrow-down'}`}>⇧</p>
										<h1>Сделка была отменена</h1>
									</div>
								);
							} else {
								return (
									<div key={index}>
										<p className={`${index === 1 ? 'arrow-down cancel-margin' : 'arrow-down'}`}>⇧</p>
										<ProductsInfo products={products} orderProducts={orderProductReverse[index]} />
									</div>
								);
							}
						} else {
							return <div key={index}></div>;
						}
					})}
				</div>
			)}
		</DealHistoryContainer>
	);
};

const DealHistoryContainer = styled.div`
	// background-color: #fff;
	text-align: center;

	& .products-history {
		// background-color: #999;
		float: right;
	}

	& .arrow-down {
		font-size: 60px;
		font-weight: 600;
		margin: 30px 0;
	}

	& .cancel-margin {
		margin-top: -10px;
	}
`;
