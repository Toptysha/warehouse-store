import styled from 'styled-components';
import { Order, OrderInfoExchangeType, ReactSelectOptionType, SaleProduct, UpdateOrderInfo, UpdatedProduct } from '../../interfaces';
import { formatDateFromDb, getProductsFromOrder, removeSizes, request } from '../../utils';
import { useEffect, useState } from 'react';
import { ACCESS, OFFLINE_DEAL, EMPTY_PRODUCT_FOR_ORDER } from '../../constants';
import { useParams } from 'react-router-dom';
import { Button, Loader, PrivateContent } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp, selectUser } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { closeLoader, closeModal, openModal } from '../../redux/reducers';
import { SingleValue } from 'react-select';
import { CancelledDeal, DealHistory, OneSaleEditInfo, OneSaleExchangeProducts, ProductsInfo } from './components';

export const OneSale = () => {
	const [order, setOrder] = useState<Order>();
	const [products, setProducts] = useState<UpdatedProduct[]>([]);
	const [initialProducts, setInitialProducts] = useState<UpdatedProduct[]>([]);
	const [articles, setArticles] = useState<ReactSelectOptionType[]>([{ value: '', label: '' }]);
	const [selectedProduct, setSelectedProduct] = useState<SingleValue<string>>('');
	const [newOrderInfo, setNewOrderInfo] = useState<UpdateOrderInfo>({
		name: order ? order?.name : '',
		address: order ? order?.address : '',
		deliveryType: order ? order?.deliveryType : '',
		deliveryPrice: order ? order?.deliveryPrice : '',
		phone: order ? order?.phone : '',
	});
	const [isExchangeProducts, setIsExchangeProducts] = useState<boolean>(false);
	const [isNewOrderInfo, setIsNewOrderInfo] = useState<boolean>(false);
	const [isCancelledDeal, setIsCancelledDeal] = useState<boolean>(false);
	const [exchangeType, setExchangeType] = useState<OrderInfoExchangeType>('none');

	const dispatch = useAppDispatch();
	const params = useParams();
	const userRole = useSelector(selectUser).roleId;

	const loader = useSelector(selectApp).loader;

	useEffect(() => {
		request(`/orders/${params.id}`).then(({ error, data }) => {
			if (error) {
				console.log('ERROR', error);
			} else {
				setOrder(data);
				setNewOrderInfo({
					name: data.name,
					address: data.address,
					deliveryType: data.deliveryType,
					deliveryPrice: data.deliveryPrice,
					phone: data.phone,
				});

				const arrOfProducts = data.product[data.product.length - 1];

				if (arrOfProducts[0].productId === null && !isExchangeProducts) {
					setIsCancelledDeal(true);
					getProductsFromOrder(data.product[data.product.length - 2]).then(({ error, data }) => {
						if (error) {
							console.log('ERROR', error);
						} else if (data) {
							setProducts(data);
							dispatch(closeLoader());
						}
					});
				} else {
					products.length === 0 &&
						getProductsFromOrder(arrOfProducts).then(({ error, data }) => {
							if (error) {
								console.log('ERROR', error);
							} else if (data) {
								setInitialProducts(data);
								setProducts(data);
								dispatch(closeLoader());
							}
						});
				}
			}
		});

		if (exchangeType === 'return') {
			dispatch(
				openModal({
					text: 'Сделать возврат товаров?',
					onConfirm: async () => {
						const deletedProducts = initialProducts.filter(({ size, sizes }) => !sizes.includes(size));

						await Promise.all(deletedProducts.map((product) => request(`/products/${product.id}`, 'PATCH', { sizes: [...product.sizes, product.size] })));

						await request(`/orders/${order?.id}`, 'PATCH', { ...order, isExchange: true, totalPrice: '0', orders: [EMPTY_PRODUCT_FOR_ORDER] });
						setExchangeType('none');
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		} else if (exchangeType === 'exchange') {
			dispatch(
				openModal({
					text: 'Сделать обмен товаров?',
					onConfirm: () => {
						setIsExchangeProducts(true);
						setExchangeType('none');
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		} else if (exchangeType === 'saveExchange') {
			dispatch(
				openModal({
					text: 'Сохранить изменения в заказе?',
					onConfirm: async () => {
						const ProductsForOrder = products
							.filter(({ size }) => !!size)
							.map((product) => ({
								product: product.id,
								size: product.size,
								price: product.price,
							}));

						let totalPrice = 0;
						products.forEach(({ price }) => {
							totalPrice += Number(price);
						});

						const currentProductsId = products.map(({ id }) => id);
						const initialProductsId = initialProducts.map(({ id }) => id);

						const deletedProductsId = initialProductsId.filter((id) => !currentProductsId.includes(id));

						const deletedProducts = initialProducts.filter(({ id }) => deletedProductsId.includes(id)).filter(({ size, sizes }) => !sizes.includes(size));

						await request(`/orders/${order?.id}`, 'PATCH', { ...order, isExchange: true, totalPrice: totalPrice.toString(), orders: ProductsForOrder });
						await Promise.all(deletedProducts.map((product) => request(`/products/${product.id}`, 'PATCH', { sizes: [...product.sizes, product.size] })));
						await removeSizes(products);
						setProducts(products.filter(({ size }) => !!size));
						setExchangeType('none');
						setIsExchangeProducts(false);
						setIsNewOrderInfo(false);
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		} else if (exchangeType === 'changeOrderInfo') {
			dispatch(
				openModal({
					text: 'Изменить информацию о доставке?',
					onConfirm: () => {
						setIsNewOrderInfo(true);
						setExchangeType('none');
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		} else if (exchangeType === 'saveInfo') {
			dispatch(
				openModal({
					text: 'Сохранить информацию о доставке?',
					onConfirm: () => {
						request(`/orders/${order?.id}`, 'PATCH', { ...newOrderInfo });
						setExchangeType('none');
						setIsNewOrderInfo(false);
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		} else if (exchangeType === 'cancelCancellation') {
			dispatch(
				openModal({
					text: 'Вернуть сделку?',
					onConfirm: () => {
						setIsCancelledDeal(false);
						setIsExchangeProducts(true);
						setExchangeType('none');
						dispatch(closeModal());
					},
					onCancel: () => {
						setExchangeType('none');
						dispatch(closeModal());
					},
				}),
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, params.id, exchangeType]);

	const isOfflineSale = order?.address === OFFLINE_DEAL && order?.deliveryType === OFFLINE_DEAL;

	const isHistory = () => {
		if (order && order.product.length > 1) {
			if ((order.product.length === 2 && order.product[1][0].productId !== null) || order.product.length > 2) {
				return true;
			}
		}
		return false;
	};

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALES}>
			{products.length > 0 ? (
				<OneSaleContainer $height={isOfflineSale ? '140px' : '450px'}>
					<div className="title">
						<h2>{isOfflineSale ? 'Продажа из магазина:' : 'Онлайн продажа:'}</h2>
					</div>
					<div className="main-info">
						{!isNewOrderInfo ? (
							<div className="order-info-block">
								{ACCESS.MAKE_ORDER.includes(userRole?.toString() as string) && !isOfflineSale && !isCancelledDeal ? (
									<div className="buttons">
										<Button
											description={`Редактировать информацию`}
											width="350px"
											onClick={() => {
												setExchangeType('changeOrderInfo');
											}}
										/>
									</div>
								) : (
									<div className="empty-block" />
								)}
								<div className="order-info">
									{!isOfflineSale && (
										<>
											<p>
												Заказчик: <span>{order?.name}</span>
											</p>
											<p>
												Телефон: <span>{order?.phone}</span>
											</p>
											<p>
												Адрес доставки: <span>{order?.address}</span>
											</p>
											<p>
												Служба доставки: <span>{order?.deliveryType}</span>
											</p>
											<p>
												Стоимость доставки: <span>{order?.deliveryPrice}</span>
											</p>
										</>
									)}
									<p>
										Стоимость товаров: <span>{order?.totalPrice}</span>
									</p>
									{order && order.product.length > 1 ? (
										<>
											<p>
												Дата заказа: <span>{order && formatDateFromDb(order.createdAt)}</span>
											</p>
											<p>
												Последнее изменение: <span>{order && formatDateFromDb(order.updatedAt)}</span>
											</p>
										</>
									) : (
										<p>
											Дата заказа: <span>{order && formatDateFromDb(order.createdAt)}</span>
										</p>
									)}

									<p>
										Продавец: <span>{order?.authorName}</span>
									</p>
								</div>
							</div>
						) : (
							order && (
								<OneSaleEditInfo
									order={order}
									setNewOrderInfo={setNewOrderInfo}
									setExchangeType={setExchangeType}
									newOrderInfo={newOrderInfo}
									setIsNewOrderInfo={setIsNewOrderInfo}
								/>
							)
						)}
						{!isExchangeProducts ? (
							<div className="products">
								{ACCESS.MAKE_ORDER?.includes(userRole?.toString() as string) && !isCancelledDeal ? (
									<div className="buttons">
										<Button
											description={`Аннулировать сделку (полный возврат)`}
											width="350px"
											onClick={() => {
												setExchangeType('return');
											}}
										/>
										<Button
											description={`Обмен товаров`}
											width="180px"
											onClick={() => {
												setExchangeType('exchange');
											}}
										/>
									</div>
								) : (
									<div className="empty-block" />
								)}
								<ProductsInfo products={products} orderProducts={order?.product[order.product.length - 1] as SaleProduct[]} />
							</div>
						) : (
							<OneSaleExchangeProducts
								initialProducts={initialProducts}
								products={products}
								setProducts={setProducts}
								selectedProduct={selectedProduct}
								setSelectedProduct={setSelectedProduct}
								articles={articles}
								setArticles={setArticles}
								setExchangeType={setExchangeType}
								setIsExchangeProducts={setIsExchangeProducts}
								setIsCancelledDeal={setIsCancelledDeal}
							/>
						)}
					</div>
					{isHistory() && order && <DealHistory order={order} />}
					{isCancelledDeal ? <CancelledDeal setExchangeType={setExchangeType} /> : <></>}
				</OneSaleContainer>
			) : (
				<Loader />
			)}
		</PrivateContent>
	);
};

const OneSaleContainer = styled.div<{ $height?: string }>`
	width: 1100px;
	margin: 0 auto;

	& .title {
		width: 100%;
		margin: 0 0 30px 10px;
		text-align: center;
	}

	& .products-title {
		width: 100%;
		margin: 0 0 20px 0px;
		text-align: center;
		font-size: 20px;
	}

	& .main-info {
		width: 100%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
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
		font-size: 16px;
	}

	& .buttons button:hover {
		text-decoration: none;
	}

	& .empty-block {
		height: 75px;
	}

	& .delivery-info {
		font-size: 20px;
		display: flex;
		align-items: center;
		margin: 5px 0 5px 10px;
		width: 100%;
		font-weight: 400;
	}

	& .delivery-info div {
		margin: 0 0 0 3px;
	}

	& .cover {
		width: 100%;
		height: 500px;
	}

	& .cover img {
		border-radius: 10px;
		width: 100%;
		height: 500px;
		object-fit: cover;
	}

	& .order-info {
		// background-color: #fff;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		text-align: left;
		width: 550px;
		height: ${({ $height = '270px' }) => $height};
		border-radius: 10px;
		border: 1px solid #000;
	}

	& .products {
		// background-color: #fff;
		width: 500px;
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
