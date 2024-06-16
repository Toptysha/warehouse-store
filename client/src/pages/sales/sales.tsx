import styled from 'styled-components';
import { Loader, Pagination, PrivateContent, Search, Switcher } from '../../components';
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

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALES}>
			{!oneSale ? (
				<SalesContainer>
					<div className="switcher">
						<Switcher position={switcherPosition} setPosition={setSwitcherPosition} positionNames={switcherNames} />
					</div>
					<Search
						searchPhrase={searchPhrase}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchPhrase(event.target.value)}
						onClick={() => setShouldSearch(!shouldSearch)}
						width="500px"
					/>
					<div className="sales">
						<div className="table-header">
							<div className="table-title">Заказчик:</div>
							<div className="table-title">Телефон:</div>
							<div className="table-title">Адрес:</div>
							<div className="table-title">Доставка:</div>
							<div className="table-title">Товар:</div>
							<div className="table-title">Цена:</div>
							<div className="table-title">Дата:</div>
							<div className="table-title">Продавец:</div>
						</div>
						<div className="table-sales">
							{switcherPosition === 0
								? sales.map((sale, index) => <SalesRow key={index} sale={sale} />)
								: switcherPosition === 1
									? salesOnline.map((sale, index) => <SalesRow key={index} sale={sale} />)
									: salesOffline.map((sale, index) => <SalesRow key={index} sale={sale} />)}
						</div>
					</div>
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
	margin: 20px auto 40px;
	min-height: 80vh;

	& .switcher {
		// background-color: #fff;
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: -40px;
	}

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

	& .sales {
		// background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 20px auto 0;
	}

	& .table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 50px;
		background-color: #f2f2f2;
		border-radius: 10px;
		margin-bottom: 10px;
		padding: 0 20px;
		box-sizing: border-box;
		font-size: 18px;
		font-weight: 600;
	}

	& .table-sales {
		width: 100%;
		max-height: 70vh;
		overflow-y: auto;
	}

	& .table-title {
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
