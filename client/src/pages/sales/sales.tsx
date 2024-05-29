import styled from 'styled-components';
import { Loader, Pagination, PrivateContent, Search } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useState } from 'react';
import { ROLE } from '../../constants';
import { SalesRow } from './components';
import { useSales } from '../../hooks';

export const Sales = () => {
	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);

	const loader = useSelector(selectApp).loader;

	const { sales, lastPage } = useSales(searchPhrase, page);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={[ROLE.ADMIN.toString()]}>
			<SalesContainer>
				<Search
					searchPhrase={searchPhrase}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchPhrase(event.target.value)}
					onClick={() => setShouldSearch(!shouldSearch)}
					width="500px"
				/>
				<div className="sales">
					<div className="table-header">
						<div className="table-title">Имя заказчика:</div>
						<div className="table-title">Телефон:</div>
						<div className="table-title">Адрес:</div>
						<div className="table-title">Доставка:</div>
						<div className="table-title">Товар:</div>
						<div className="table-title">Продал:</div>
					</div>
					{sales.map((sale, index) => (
						<SalesRow key={index} sale={sale} />
					))}
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
	margin: 40px auto;
	min-height: 80vh;

	& .sales {
		// background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		// justify-content: center;
		width: 100%;
		max-height: 70vh;
		overflow-y: auto;
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

	& .table-title {
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		// border: 1px solid black;
	}
`;
