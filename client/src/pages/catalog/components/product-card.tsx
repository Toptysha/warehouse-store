import styled from 'styled-components';
import { PhotoGallery } from './photo-gallery';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../../interfaces';
import { Button } from '../../../components';
import { deleteProduct } from '../../../utils';
import { Dispatch, SetStateAction, useState } from 'react';

export const ProductCard = ({
	product,
	images,
	needRefreshPage,
	setNeedRefreshPage,
}: {
	product: Product;
	images: string[];
	needRefreshPage: boolean;
	setNeedRefreshPage: Dispatch<SetStateAction<boolean>>;
}) => {
	const [disabledButtons, setDisabledButtons] = useState(false);
	const navigate = useNavigate();
	return (
		<ProductCardContainer>
			<PhotoGallery images={images} path={`/catalog/${product.id}`} />
			<Link to={`/catalog/${product.id}`}>
				<div className="product-card-info">
					<p>{`Артикул: ${product.article}`}</p>
					<p>{`Бренд: ${product.brand}`}</p>
					<p>{`Наименование: ${product.name}`}</p>
					<p>{`Цвет: ${product.color}`}</p>
					<p>{`Цена: ${product.price}`}</p>
					<p>{`Размеры: ${product.sizes.join(', ')}`}</p>
				</div>
			</Link>
			<div className="buttons">
				<Button
					description="Редактировать"
					disabled={disabledButtons}
					onClick={() => {
						setDisabledButtons(true);
						navigate(`/catalog/${product.id}/edit`);
					}}
				/>
				<Button
					description="Удалить"
					disabled={disabledButtons}
					onClick={() => {
						setDisabledButtons(true);
						deleteProduct(product.id);
						setNeedRefreshPage(!needRefreshPage);
					}}
				/>
			</div>
		</ProductCardContainer>
	);
};

const ProductCardContainer = styled.div`
	border: 1px solid black;
	border-radius: 5px;
	margin: 25px;

	& a {
		color: black;
		text-decoration: none;
	}

	& .product-card-info {
		width: 290px;
		margin: 5px;
	}

	& .buttons {
		display: flex;
		justify-content: space-between;
		margin: 5px;
	}

	& .buttons button {
		width: 120px;
		font-size: 14px;
		background: none;
		border: none;
		text-decoration: underline;
	}

	& .buttons button:hover {
		// background-color: #dbdbdb;
		text-decoration: none;
	}
`;
