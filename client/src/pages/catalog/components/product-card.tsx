import styled from 'styled-components';
import { PhotoGallery } from './photo-gallery';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../../interfaces';
import { Button } from '../../../components';
import { Dispatch, SetStateAction, useState } from 'react';
import { useDeleteProduct } from '../../../hooks';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/selectors';
import { ACCESS } from '../../../constants';

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
	const deleteProductHandler = useDeleteProduct();

	const userRole = useSelector(selectUser).roleId?.toString() as string;

	return (
		<ProductCardContainer>
			<PhotoGallery images={images} path={`/catalog/${product.id}`} />
			<Link to={`/catalog/${product.id}`}>
				<div className="product-card-info">
					<p>
						Артикул: <span>{product.article}</span>
					</p>
					<p>
						Бренд: <span>{product.brand}</span>
					</p>
					<p>
						Наименование: <span>{product.name}</span>
					</p>
					<p>
						Цвет: <span>{product.color}</span>
					</p>
					<p>
						Цена: <span>{product.price}</span>
					</p>
					<p>
						Размеры: <span>{product.sizes.join(', ')}</span>
					</p>
				</div>
			</Link>
			{ACCESS.DELETE_PRODUCTS.includes(userRole) && (
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
							deleteProductHandler(product.id, '/catalog', needRefreshPage, setNeedRefreshPage);
						}}
					/>
				</div>
			)}
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

	& .product-card-info p {
		width: 100%;
		font-size: 15px;
		font-weight: 400;
		margin: 0px 0 0 10px;
	}

	& .product-card-info span {
		font-size: 16px;
		font-weight: 500;
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
		text-decoration: none;
	}
`;
