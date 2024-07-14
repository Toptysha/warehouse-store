import styled from 'styled-components';
import { Loader, Pagination, PrivateContent, Table } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useEffect, useState } from 'react';
import { ACCESS, PAGINATION_LIMIT, tableHeadersExchange } from '../../constants';
import { request } from '../../utils';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';
import { Order } from '../../interfaces';
import { ExchangeRow } from './components';

export const Exchanges = () => {
	const [exchangeOrders, setExchangeOrders] = useState<Order[]>([]);
	const [returnOrders, setReturnOrders] = useState<Order[]>([]);
	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [lastPage, setLastPage] = useState(1);
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const switcherNames = ['Обмены', 'Возвраты'];

	const loader = useSelector(selectApp).loader;
	const dispatch = useAppDispatch();

	useEffect(() => {
		request(`/orders/exchanges?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`).then(({ error, data }) => {
			if (error) {
				console.error(error);
				dispatch(closeLoader());
			} else {
				setLastPage(data.lastPage);

				let returnOrdersData: Order[] = [];
				let exchangeOrdersData: Order[] = [];

				data.orders.forEach((order: Order) => {
					if (order.product[order.product.length - 1][0].productId === null) {
						returnOrdersData.push(order);
					} else {
						exchangeOrdersData.push(order);
					}
				});
				setExchangeOrders(exchangeOrdersData);
				setReturnOrders(returnOrdersData);
				dispatch(closeLoader());
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, page, searchPhrase]);

	const tableHeaders = tableHeadersExchange().map(({ key }) => key);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALES}>
			<ExchangesContainer>
				<Table
					headers={tableHeaders}
					$headerFontSize="18px"
					tablePoints={[
						exchangeOrders.map((order, index) => <ExchangeRow key={index} order={order} />),
						returnOrders.map((order, index) => <ExchangeRow key={index} order={order} isReturned={true} />),
					]}
					isSwitcher={true}
					isSearch={true}
					switcherArgs={{ position: switcherPosition, setPosition: setSwitcherPosition, positionNames: switcherNames }}
					searchArgs={{ searchPhrase, setSearchPhrase, shouldSearch, setShouldSearch }}
				/>
				{lastPage > 1 && <Pagination page={page} setPage={setPage} lastPage={lastPage} />}
			</ExchangesContainer>
		</PrivateContent>
	);
};

const ExchangesContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 0 auto 40px;
	min-height: 80vh;

	& .sales-stats {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: 30px 0 0;
	}

	& .sales-stats a {
		color: #000;
		font-size: 18px;
		font-weight: 500;
	}

	& .sales-stats a:hover {
		text-decoration: none;
	}
`;
