import { Route, Routes, useLocation } from 'react-router-dom';
import { Authorization, Catalog, Main, Product, Users } from './pages';
import { Header, Footer, Modal, Location, Error } from './components';
import { useAppDispatch } from './redux/store';
import { useEffect, useLayoutEffect } from 'react';
import { openLoader, removeError, setError, setUser } from './redux/reducers';
import { request } from './utils';
// import { useSelector } from 'react-redux';
// import { selectApp } from './redux/selectors';
import { ERROR } from './constants';

export default function App() {
	const dispatch = useAppDispatch();
	// const navigate = useNavigate();
	const location = useLocation();

	// const loader = useSelector(selectApp).loader;

	useEffect(() => {
		dispatch(openLoader());
		dispatch(removeError());
	}, [location.pathname, dispatch]);

	useLayoutEffect(() => {
		request('/me').then(({ error, data }) => {
			if (error) {
				// console.log('/me', error);
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
				<Route path="/users" element={<Users />} />
				<Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} />
			</Routes>
			<Footer />
			<Modal />

			{/* <AppColumn> */}
			{/* <Header /> */}
			{/* <Page> */}
			{/* <Routes> */}
			{/* <Route path="/" element={<Main />} /> */}
			{/* <Route path="/login" element={<Authorization />} /> */}
			{/* <Route path="/register" element={<Registration />} /> */}
			{/* <Route path="/users" element={<Users />} /> */}
			{/* <Route path="/post" element={<div>POST!!</div>} /> */}
			{/* <Route path="/post/:id" element={<Post />} /> */}
			{/* <Route path="/post/:id/edit" element={<Post />} /> */}
			{/* <Route path="*" element={<Error error={ERROR.PAGE_NOT_EXIST} />} /> */}
			{/* </Routes> */}
			{/* </Page> */}
			{/* <Footer /> */}
			{/* <Modal /> */}
			{/* </AppColumn> */}
			{/* // <Routes>{user.roleId === ROLE.GUEST ? <Route path="/" element={<Registration />} /> : <Route path="/" element={<Main />} />}</Routes> */}
		</div>
	);
}
