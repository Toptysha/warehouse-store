import { Route, Routes, useLocation } from 'react-router-dom';
import { Authorization, Catalog, Main, Product, Sales, SalesStats, Users } from './pages';
import { Header, Footer, Modal, Location, Error } from './components';
import { useAppDispatch } from './redux/store';
import { useEffect, useLayoutEffect } from 'react';
import { openLoader, removeError, setError, setUser } from './redux/reducers';
import { request } from './utils';
import { ERROR } from './constants';
import { MakeOrder } from './pages/make-order/make-order';

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
		<div className="App">
			<Header />
			<Location />
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/login" element={<Authorization />} />
				<Route path="/catalog" element={<Catalog />} />
				<Route path="/catalog/:id" element={<Product />} />
				<Route path="/catalog/:id/edit" element={<Product />} />
				<Route path="/catalog/create-product" element={<Product />} />
				<Route path="/order" element={<MakeOrder />} />
				<Route path="/sales" element={<Sales />} />
				<Route path="/sales/:id" element={<Sales />} />
				<Route path="/sales/stats" element={<SalesStats />} />
				<Route path="/users" element={<Users />} />
				<Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} />
			</Routes>
			<Footer />
			<Modal />
		</div>
	);
}
