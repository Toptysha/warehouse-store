import styled from 'styled-components';
import { Loader, Pagination, PrivateContent, Table } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useState } from 'react';
import { ACCESS, OFFLINE_DEAL } from '../../constants';
import { OneSale, SalesRow } from './components';
import { useSales } from '../../hooks';
import { Sale } from '../../interfaces';
import { Link, useMatch } from 'react-router-dom';

export const Sales = () => {
	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const switcherNames = ['Все продажи', 'Продажи онлайн', 'Продажи в магазине'];

	const oneSale = useMatch('/sales/:id');

	const loader = useSelector(selectApp).loader;

	const { sales, lastPage } = useSales(searchPhrase, page);

	const { salesOnline, salesOffline } = sales.reduce<{
		salesOnline: Sale[];
		salesOffline: Sale[];
	}>(
		(acc, sale) => {
			if (sale.name !== OFFLINE_DEAL && sale.phone !== OFFLINE_DEAL) {
				acc.salesOnline.push(sale);
			} else if (sale.name === OFFLINE_DEAL && sale.phone === OFFLINE_DEAL) {
				acc.salesOffline.push(sale);
			}
			return acc;
		},
		{ salesOnline: [], salesOffline: [] },
	);

	const currentSale = sales.filter((sale) => oneSale?.params.id === sale.id);
	const tableHeaders = ['Заказчик', 'Телефон', 'Адрес', 'Доставка', 'Товар', 'Цена', 'Дата', 'Продавец'];

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALES}>
			{!oneSale ? (
				<SalesContainer>
					<Table
						headers={tableHeaders}
						$headerFontSize="18px"
						tablePoints={[
							sales.map((sale, index) => <SalesRow key={index} sale={sale} />),
							salesOnline.map((sale, index) => <SalesRow key={index} sale={sale} />),
							salesOffline.map((sale, index) => <SalesRow key={index} sale={sale} />),
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
			) : (
				<OneSale sale={currentSale} />
			)}
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
