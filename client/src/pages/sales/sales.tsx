import styled from 'styled-components';
import { Loader, Pagination, PrivateContent, Table } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useState } from 'react';
import { ACCESS } from '../../constants';
import { SalesRow } from './components';
import { useOrders } from '../../hooks';
import { Link } from 'react-router-dom';
import { tableHeadersSale } from '../../constants/table-headers-sale';

export const Sales = () => {
	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const switcherNames = ['Все продажи', 'Продажи онлайн', 'Продажи в магазине'];

	const loader = useSelector(selectApp).loader;

	const { orders, ordersOnline, ordersOffline, lastPage } = useOrders(searchPhrase, page);

	const tableHeaders = tableHeadersSale().map(({ key }) => key);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALES}>
			<SalesContainer>
				<Table
					headers={tableHeaders}
					$headerFontSize="18px"
					tablePoints={[
						orders.map((order) => <SalesRow key={order.id} order={order} />),
						ordersOnline.map((order) => <SalesRow key={order.id} order={order} />),
						ordersOffline.map((order) => <SalesRow key={order.id} order={order} />),
					]}
					isSwitcher={true}
					isSearch={true}
					switcherArgs={{ position: switcherPosition, setPosition: setSwitcherPosition, positionNames: switcherNames }}
					searchArgs={{ searchPhrase, setSearchPhrase, shouldSearch, setShouldSearch }}
				/>
				<div className="sales-stats">
					<Link to={`/sales/stats`}>Статистика продаж</Link>
				</div>
				{lastPage > 1 && <Pagination page={page} setPage={setPage} lastPage={lastPage} />}
			</SalesContainer>
		</PrivateContent>
	);
};

const SalesContainer = styled.div`
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
