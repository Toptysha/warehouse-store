// import cover1 from '../../images/cover1.jpg';
// import cover2 from '../../images/cover2.jpg';
// import cover3 from '../../images/cover3.jpg';
// import cover4 from '../../images/cover4.jpg';
import { useEffect, useState } from 'react';
import { Link, useMatch, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../../redux/store';
import { Error } from '../../components';
import { ProductContent, ProductCreate, ProductEdit } from './components';

export const Product = () => {
	// const images = [cover1, cover2, cover3, cover4];
	const dispatch = useAppDispatch();
	const params = useParams();
	const isCreating = useMatch('/catalog/create-product');
	const isEditing = useMatch('/catalog/:id/edit');

	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// useLayoutEffect(() => {
	// 	dispatch(RESET_POST_DATA);
	// }, [dispatch]);

	// useEffect(() => {
	// 	if (isCreating) {
	// 		setIsLoading(false);
	// 		return;
	// 	}

	// 	dispatch(loadPostAsync(params.id)).then((postData) => {
	// 		setError(postData.error);
	// 		setIsLoading(false);
	// 	});
	// }, [dispatch, params.id, isCreating]);

	useEffect(() => {
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return null;
	}

	const ProductPage = () => {
		if (isCreating) {
			return <ProductCreate></ProductCreate>;
		} else if (isEditing) {
			return <ProductEdit></ProductEdit>;
		}
		return <ProductContent></ProductContent>;
	};

	// return error ? <Error error={error} /> : ProductPage;

	return <ProductContainer>{error ? <Error error={error} /> : ProductPage()}</ProductContainer>;
};

const ProductContainer = styled.div`
	width: 1100px;
	margin: 0 auto;
	padding-top: 25px;
	min-height: 900px;

	& .products-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
`;
