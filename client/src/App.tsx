import { Route, Routes, useLocation } from 'react-router-dom';
import { AccountExchange, Authorization, Catalog, Exchanges, Logs, Main, OneSale, Product, Sales, SalesStats, Schedule, Users } from './pages';
import { Header, Footer, Modal, Location, Error } from './components';
import { useAppDispatch } from './redux/store';
import { useEffect, useLayoutEffect } from 'react';
import { openLoader, removeError, setError, setUser } from './redux/reducers';
import { request } from './utils';
import { ERROR } from './constants';
import { MakeOrder } from './pages/make-order/make-order';
import styled from 'styled-components';

export default function App() {
	const dispatch = useAppDispatch();
	const location = useLocation();

	useEffect(() => {
		dispatch(openLoader());
		dispatch(removeError());
	}, [location.pathname, dispatch]);

	useLayoutEffect(() => {
		request('/me').then(({ error, data }) => {
			if (error) {
				dispatch(setError(error.error));
			} else {
				dispatch(setUser(data));
			}
		});
	}, [dispatch]);

	return (
		<AppContainer>
			<Header />
			<div className="content">
				<Location />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/login" element={<Authorization />} />
					<Route path="/account_exchange" element={<AccountExchange />} />
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/catalog/:id" element={<Product />} />
					<Route path="/catalog/:id/edit" element={<Product />} />
					<Route path="/catalog/create-product" element={<Product />} />
					<Route path="/order" element={<MakeOrder />} />
					<Route path="/sales" element={<Sales />} />
					<Route path="/sales/:id" element={<OneSale />} />
					<Route path="/sales/stats" element={<SalesStats />} />
					<Route path="/exchanges" element={<Exchanges />} />
					<Route path="/users" element={<Users />} />
					<Route path="/logs" element={<Logs />} />
					<Route path="/schedule" element={<Schedule />} />
					<Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} />
				</Routes>
			</div>
			<Footer />
			<Modal />
		</AppContainer>
	);
}

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;

	& .content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
`;
