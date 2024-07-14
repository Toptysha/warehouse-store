import { Link } from 'react-router-dom';
import { LOG_ACTIONS, ROLES_FOR_CLIENT } from '../../../constants';
import { ActionLog } from '../../../interfaces';
import { formatDateFromDb } from '../../../utils';
import styled from 'styled-components';
import React from 'react';

export const LogActionMessage = ({ log }: { log: ActionLog }) => {
	let productChanges;
	let orderChanges;

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
			orderChanges = { key: 'имя покупателя', ValueOld: log.order?.nameOld, ValueNew: log.order?.nameNew };
		} else if (log.order?.phoneOld !== log.order?.phoneNew) {
			orderChanges = { key: 'телефон', ValueOld: log.order?.phoneOld, ValueNew: log.order?.phoneNew };
		} else if (log.order?.addressOld !== log.order?.addressNew) {
			orderChanges = { key: 'адрес', ValueOld: log.order?.addressOld, ValueNew: log.order?.addressNew };
		} else if (log.order?.deliveryTypeOld !== log.order?.deliveryTypeNew) {
			orderChanges = { key: 'доставку', ValueOld: log.order?.deliveryTypeOld, ValueNew: log.order?.deliveryTypeNew };
		} else if (log.order?.deliveryPriceOld !== log.order?.deliveryPriceNew) {
			orderChanges = { key: 'цену доставки', ValueOld: log.order?.deliveryPriceOld, ValueNew: log.order?.deliveryPriceNew };
		} else if (checkProductsInOrder()) {
			orderChanges = {
				key: 'товары',
				ValueOld: productsOldArticles && productsOldArticles?.length > 0 ? productsOldArticles?.join(', ') : 'отсутствия товаров',
				ValueNew: productsNewArticles && productsNewArticles?.length > 0 ? productsNewArticles?.join(', ') : 'отсутствие товаров',
			};
		}
	}

	switch (log.action) {
		case LOG_ACTIONS.PRODUCT_ACTIONS.ADD:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Добавила новый товар - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.UPDATE_INFO:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  изменила {productChanges?.key} у товара - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link> c{' '}
					{productChanges?.ValueOld} на {productChanges?.ValueNew}, <span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.ADD_PHOTOS:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Добавила товару - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>{' '}
					{log.product?.isChangedMeasurements ? `замеров к ${log.product.changedMeasurementsSize} размеру` : `обложек`}, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE_PHOTOS:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Добавила у товара - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.PRODUCT_ACTIONS.REMOVE:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Удалила товар - <Link to={`/catalog/${log.product?.id}`}>{log.product?.article}</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.ADD:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Создала <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.UPDATE:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  изменила {orderChanges?.key}, в{' '}
					<span className="bold">
						<Link to={`/order/${log.order?.id}`}>ПРОДАЖЕ</Link>
					</span>
					, c{' '}
					{checkProductsInOrder()
						? log.order?.productsOld?.map(({ id, article }) => (
								<React.Fragment key={id}>
									<Link to={`/catalog/${id}`}>{article}</Link>,  
								</React.Fragment>
							))
						: orderChanges?.ValueOld}
					на{' '}
					{checkProductsInOrder() ? (
						log.order?.productsNew?.map(({ id, article }) => (
							<React.Fragment key={id}>
								<Link to={`/catalog/${id}`}>{article}</Link>,  
							</React.Fragment>
						))
					) : (
						<>{orderChanges?.ValueNew}, </>
					)}
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.CANCEL:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Отменила <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.ORDER_ACTIONS.CANCEL_CANCELLATION:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Вернула <Link to={`/order/${log.order?.id}`}>ЗАКАЗ</Link>, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		case LOG_ACTIONS.USER_ACTIONS.UPDATE_ROLE:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  изменила роль пользователя - <span className="author-name">{log.user?.id}</span> c 
					{roleName(log.user?.roleOld as string)} на {roleName(log.user?.roleNew as string)}, 
					<span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
		default:
			return (
				<RawContainer>
					<span className="author-name">{log.author}</span>  Неизвестная операция, <span className="date">{formatDateFromDb(log.createdAt)}</span>
				</RawContainer>
			);
	}
};

const RawContainer = styled.p`
	// font-weight: 500;

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

	& .date {
		font-style: italic;
		font-size: 14px;
		font-weight: 500;
	}
`;
