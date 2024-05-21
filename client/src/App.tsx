import { Route, Routes, useNavigate } from 'react-router-dom';
import { Authorization, Catalog, Main, Product } from './pages';
import { Header, Footer, Modal } from './components';
import { useAppDispatch } from './redux/store';
import { useLayoutEffect, useState } from 'react';
import { setUser } from './redux/reducers';
import { request } from './utils';

export default function App() {
	const [loader, setLoader] = useState(true);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useLayoutEffect(() => {
		request('/me').then(({ error, data }) => {
			if (error) {
				setLoader(false);
				return;
			}
			setLoader(false);
			dispatch(setUser(data));
		});
	}, [dispatch, navigate]);

	return !loader ? (
		<div className="App">
			<>
				<Header />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/login" element={<Authorization />} />
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/catalog/:id" element={<Product />} />
					<Route path="/catalog/:id/edit" element={<Product />} />
					<Route path="/catalog/create-product" element={<Product />} />
				</Routes>
				<Footer />
				<Modal />
			</>

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
	) : (
		<></>
	);
}
