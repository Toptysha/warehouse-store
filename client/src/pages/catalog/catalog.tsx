import noImage from '../../images/no_img.jpg';
import styled from 'styled-components';
import { ProductCard } from './components';
import { Button, Loader, PrivateContent, Search } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { request } from '../../utils';
import { Pagination } from '../../components';
import { PAGINATION_LIMIT } from '../../constants';
import { Product } from '../../interfaces';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { ACCESS } from '../../constants/access';

export const Catalog = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [images, setImages] = useState([]);
	const [lastPage, setLastPage] = useState(1);
	const [page, setPage] = useState(1);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [needRefreshPage, setNeedRefreshPage] = useState(false);

	const navigate = useNavigate();

	const dispatch = useAppDispatch();
	const loader = useSelector(selectApp).loader;

	useEffect(() => {
		request(`/products?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`).then(({ error, data }) => {
			if (error) {
				console.log('/catalog', error);
				// dispatch(setError(error));
				dispatch(closeLoader());
			} else {
				console.log('/catalog', data);
				setProducts(data.products);
				setLastPage(data.lastPage);
				setImages(data.coversUrls);
				dispatch(closeLoader());
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, shouldSearch, needRefreshPage]);

	const currentCoversUrls = (id: string) => {
		const objWithPhoto = images.find((obj) => Object.keys(obj)[0] === id);
		const values = objWithPhoto ? Object.values(objWithPhoto)[0] : [];
		const currentArr: string[] = Array.isArray(values) ? values : [];

		return currentArr.length > 0 ? currentArr : [noImage];
	};

	const fillFakeProduct = () => {
		let stackProducts = [];
		for (let i = 0; i < PAGINATION_LIMIT; i++) {
			if (i < products.length) {
				stackProducts.push(
					<ProductCard key={i} product={products[i]} images={currentCoversUrls(products[i].id)} needRefreshPage={needRefreshPage} setNeedRefreshPage={setNeedRefreshPage} />,
				);
			} else {
				stackProducts.push(<div key={i} className="fake-product"></div>);
			}
		}
		return stackProducts;
	};

	return !loader ? (
		<PrivateContent access={ACCESS.CATALOG}>
			<CatalogContainer>
				<div className="products-panel">
					<Search
						searchPhrase={searchPhrase}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchPhrase(event.target.value)}
						onClick={() => setShouldSearch(!shouldSearch)}
						width="500px"
					/>
					<Button className="add-product-button" description="Добавить товар" onClick={() => navigate('/catalog/create-product')} />
				</div>
				<div className="products-container">
					{products.length > 0 ? (
						products.length === PAGINATION_LIMIT ? (
							products.map((product, index) => (
								<ProductCard key={index} product={product} images={currentCoversUrls(product.id)} needRefreshPage={needRefreshPage} setNeedRefreshPage={setNeedRefreshPage} />
							))
						) : (
							fillFakeProduct().map((product) => product)
						)
					) : (
						<div className="no-products">Нет товаров</div>
					)}
				</div>
				{lastPage > 1 && <Pagination page={page} setPage={setPage} lastPage={lastPage} />}
			</CatalogContainer>
		</PrivateContent>
	) : (
		<Loader />
	);
};

const CatalogContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 60px auto 0;
	padding-top: 25px;
	min-height: 1100px;

	& .products-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		min-height: 650px;
	}

	& .add-product-button {
		margin: 40px 360px 0;
		width: 180px;
		background: none;
		border: none;
		text-decoration: underline;
	}

	& .add-product-button:hover {
		text-decoration: none;
	}

	& .no-products {
		text-align: center;
		width: 1100px;
	}

	& .fake-product {
		background: rgba(0, 0, 0, 0);
		width: 300px;
		height: 400px;
		margin: 25px;
	}
`;
