import { Link } from 'react-router-dom';
import { LOG_ACTIONS, ROLES_FOR_CLIENT } from '../../../constants';
import { ActionLog } from '../../../interfaces';
import { formatDateFromDb } from '../../../utils';
import styled from 'styled-components';
import React from 'react';

interface Changes {
	key?: string;
	ValueOld?: string;
	ValueNew?: string;
}

interface productsInOrdersLogs {
	id: string;
	article: string;
}

export const LogActionMessage = ({ log }: { log: ActionLog }) => {
	let productChanges: Changes = {
		key: '',
		ValueOld: '',
		ValueNew: '',
	};
	let orderChanges: Changes[] = [];

	const checkSizes = () => {
		if (log.product?.sizesOld?.length === log.product?.sizesNew?.length) {
			log.product?.sizesOld?.forEach((size) => {
				if (!log.product?.sizesNew?.includes(size)) {
					return true;
				}
			});
		} else {
			return true;
		}
		return false;
	};

	const checkProductsInOrder = () => {
		if (log.order?.productsOld?.length === log.order?.productsNew?.length) {
			log.order?.productsOld?.forEach((productId) => {
				if (!log.order?.productsNew?.includes(productId)) {
					return true;
				}
			});
		} else {
			return true;
		}
		return false;
	};

	const roleName = (roleId: string) => {
		return Object.entries(ROLES_FOR_CLIENT).reduce((acc, [key, value]) => {
			if (Number(value) === Number(roleId)) {
				acc = key;
			}
			return acc;
		}, '');
	};

	const productsOldArticles = log.order?.productsOld?.map(({ article }) => article);
	const productsNewArticles = log.order?.productsNew?.map(({ article }) => article);

	if (log.action === LOG_ACTIONS.PRODUCT_ACTIONS.UPDATE_INFO) {
		if (log.product?.brandOld !== log.product?.brandNew) {
			productChanges = { key: 'бренд', ValueOld: log.product?.brandOld, ValueNew: log.product?.brandNew };
		} else if (log.product?.nameOld !== log.product?.nameNew) {
			productChanges = { key: 'наименование', ValueOld: log.product?.nameOld, ValueNew: log.product?.nameNew };
		} else if (log.product?.colorOld !== log.product?.colorNew) {
			productChanges = { key: 'цвет', ValueOld: log.product?.colorOld, ValueNew: log.product?.colorNew };
		} else if (log.product?.priceOld !== log.product?.priceNew) {
			productChanges = { key: 'цену', ValueOld: log.product?.priceOld, ValueNew: log.product?.priceNew };
		} else if (checkSizes()) {
			productChanges = {
				key: 'размерный ряд',
				ValueOld: log.product?.sizesOld && log.product?.sizesOld?.length > 0 ? log.product?.sizesOld?.join(', ') : 'отсутствия размеров',
				ValueNew: log.product?.sizesNew && log.product?.sizesNew?.length > 0 ? log.product?.sizesNew?.join(', ') : 'отсутствие размеров',
			};
		}
	}

	if (log.action === LOG_ACTIONS.ORDER_ACTIONS.UPDATE) {
		if (log.order?.nameOld !== log.order?.nameNew) {
			orderChanges.push({ key: 'имя покупателя', ValueOld: log.order?.nameOld, ValueNew: log.order?.nameNew });
		}
		if (log.order?.phoneOld !== log.order?.phoneNew) {
			orderChanges.push({ key: 'телефон', ValueOld: log.order?.phoneOld, ValueNew: log.order?.phoneNew });
		}
		if (log.order?.addressOld !== log.order?.addressNew) {
			orderChanges.push({ key: 'адрес', ValueOld: log.order?.addressOld, ValueNew: log.order?.addressNew });
		}
		if (log.order?.deliveryTypeOld !== log.order?.deliveryTypeNew) {
			orderChanges.push({ key: 'доставку', ValueOld: log.order?.deliveryTypeOld, ValueNew: log.order?.deliveryTypeNew });
		}
		if (log.order?.deliveryPriceOld !== log.order?.deliveryPriceNew) {
			orderChanges.push({ key: 'цену доставки', ValueOld: log.order?.deliveryPriceOld, ValueNew: log.order?.deliveryPriceNew });
		}
		if (checkProductsInOrder()) {
			orderChanges.push({
				key: 'товары',
				ValueOld: productsOldArticles && productsOldArticles?.length > 0 ? productsOldArticles?.join(', ') : 'отсутствия товаров',
				ValueNew: productsNewArticles && productsNewArticles?.length > 0 ? productsNewArticles?.join(', ') : 'отсутствие товаров',
			});
		}
	}

	const ProductArticles = ({ products }: { products: productsInOrdersLogs[] }) => (
		<>
			{products.map(({ id, article }, index) => (
				<React.Fragment key={id}>
					<Link to={`/catalog/${id}`}>{article}</Link>
					{index !== products.length - 1 && <>, </>}
				</React.Fragment>
			))}
		</>
	);

	switch (log.action) {
		case LOG_ACTIONS.PRODUCT_ACTIONS.ADD:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  добавила новый товар - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.UPDATE_INFO:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  изменила {productChanges?.key} у товара - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link> c 
					<span className="log-info">{productChanges?.ValueOld}</span> на <span className="log-info">{productChanges?.ValueNew}</span>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.ADD_PHOTOS:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  добавила товару - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>
					{log.product?.isChangedMeasurements ? ` замеров к ${log.product.changedMeasurementsSize} размеру` : ` обложек`}, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE_PHOTOS:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  удалила у товара - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>
					{log.product?.isChangedMeasurements ? ` замеры к ${log.product.changedMeasurementsSize} размеру` : ` обложки`}, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  удалила товар - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.ADD:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span> создала <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.UPDATE:
			return (
				<RawContainer>
					<div>
						<span className="author-name">{log.author}</span> в этой 
						<span className="bold">
							<Link to={`/order/${log.order?.id}`}>ПРОДАЖЕ</Link>
						</span>
						 изменила 
					</div>
					<div className="change-container">
						{orderChanges.map((orderPoint, index) => {
							return (
								<div className="order-points" key={index}>
									{orderPoint.key} c 
									{checkProductsInOrder() ? (
										<>
											<ProductArticles products={log.order?.productsOld as productsInOrdersLogs[]} /> 
										</>
									) : (
										<span className="log-info">{orderPoint.ValueOld} </span>
									)}
									на 
									{checkProductsInOrder() ? (
										<ProductArticles products={log.order?.productsNew as productsInOrdersLogs[]} />
									) : (
										<span className="log-info">{orderPoint?.ValueNew}</span>
									)}
									{index !== orderChanges.length - 1 ? <> и </> : <>, </>}
								</div>
							);
						})}
					</div>
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.CANCEL:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span> отменила <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.CANCEL_CANCELLATION:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span> вернула <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		case LOG_ACTIONS.USER_ACTIONS.UPDATE_ROLE:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span> изменила роль пользователя - <span className="author-name">{log.user?.id}</span> c 
					<span className="log-info">{roleName(log.user?.roleOld as string)}</span> на <span className="log-info">{roleName(log.user?.roleNew as string)}</span>, 
					<div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
		default:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  неизвестная операция, <div className="date">{formatDateFromDb(log.createdAt)}</div>
				</RawContainer>
			);
	}
};

const RawContainer = styled.div`
	// font-weight: 500;
	display: flex;
	align-items: center;

	& a {
		color: #000;
	}

	& a:hover {
		color: #b00;
		text-decoration: none;
		transition: 0.3s;
	}

	& .author-name {
		font-size: 16px;
		font-weight: 500;
	}

	& .log-info {
		font-weight: 500;
	}

	& .date {
		// background-color: #b00;
		font-style: italic;
		font-size: 14px;
		font-weight: 500;
	}

	& .change-container {
		// background-color: #b00;
		// max-width: 750px;
		width: 700px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin: 7px 0 5px;
		// padding: 0 10px;
	}
	& .order-points {
		// background-color: #0b0;
		width: 100%;
	}
`;
