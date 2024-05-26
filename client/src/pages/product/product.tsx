import { useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { ProductContent, ProductCreate, ProductEdit } from './components';

export const Product = () => {
	const isCreating = useMatch('/catalog/create-product');
	const isEditing = useMatch('/catalog/:id/edit');

	const ProductPage = () => {
		if (isCreating) {
			return <ProductCreate></ProductCreate>;
		} else if (isEditing) {
			return <ProductEdit></ProductEdit>;
		}
		return <ProductContent></ProductContent>;
	};

	return (
		<ProductContainer>
			<ProductPage />
		</ProductContainer>
	);
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
