import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactSelectOptionType, UpdatedProduct } from '../../../interfaces';
import { DeleteLine, Input } from '../../../components';
import { Dispatch, SetStateAction } from 'react';
import Select, { SingleValue } from 'react-select';
import { reactSelectStyles, trimmingText } from '../../../utils';

export const SelectedProducts = ({ products, setProducts }: { products: UpdatedProduct[]; setProducts: Dispatch<SetStateAction<UpdatedProduct[]>> }) => {
	const onChangeParam = (event: React.ChangeEvent<HTMLInputElement> | null, id: string, paramType: 'price' | 'size' | 'isDeletedSize', option?: SingleValue<ReactSelectOptionType>) => {
		let newProducts: UpdatedProduct[] = products.map((product) => {
			if (product.id === id) {
				if (paramType === 'price') {
					return {
						...product,
						price: event?.target.value || product.price,
					};
				} else if (paramType === 'size') {
					return {
						...product,
						size: option?.value || product.sizes[0],
					};
				} else if (paramType === 'isDeletedSize') {
					return {
						...product,
						isDeletedSize: !product.isDeletedSize,
					};
				}
			}
			return product;
		});

		setProducts(newProducts);
	};

	const onDeleteProduct = (index: number) => {
		setProducts(products.filter((_, i) => i !== index));
	};

	return (
		<SelectedProductsContainer>
			{products.map((product, index) => (
				<div key={index} className="product">
					<DeleteLine onClick={() => onDeleteProduct(index)} />
					<img src={product.cover} alt={'COVER'} />
					<div className="product-card-info">
						<p>
							Артикул: <Link to={`/catalog/${product.id}`}>{product.article}</Link>
						</p>
						<p>
							Бренд: <span>{trimmingText(product.brand, 21)}</span>
						</p>
						<p>
							Наименование: <span>{trimmingText(product.name, 14)}</span>
						</p>
						<p>
							Цвет: <span>{trimmingText(product.color, 22)}</span>
						</p>
						<p>Цена: </p>
						<div className="input-price">
							<Input
								type="number"
								width="100px"
								placeholder={`${product.price}`}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeParam(event, product.id, 'price')}
							/>
						</div>
						<p>Размер: </p>
						<Select
							className="select-size"
							value={product.size ? { value: product.size, label: product.size } : null}
							onChange={(option: SingleValue<ReactSelectOptionType>) => onChangeParam(null, product.id, 'size', option)}
							options={product.sizes.map((size) => ({ value: size, label: size }))}
							isClearable
							isSearchable
							noOptionsMessage={() => 'Нет совпадений'}
							placeholder={product.sizes[0]}
							styles={reactSelectStyles('170px')}
						/>
						<label>
							<input type="checkbox" checked={product.isDeletedSize} onChange={() => onChangeParam(null, product.id, 'isDeletedSize')} />
							<span>Последний оставшийся размер?</span>
						</label>
					</div>
				</div>
			))}
		</SelectedProductsContainer>
	);
};

const SelectedProductsContainer = styled.div`
	// background: red;
	display: flex;
	flex-wrap: wrap;
	margin: 10px auto;
	width: 100%;
	overflow-y: auto;

	& span {
		font-weight: 400;
	}

	& .product-card-info {
		width: 100%;
	}

	& .product-card-info p {
		font-size: 20px;
		font-weight: 500;
		text-align: left;
		margin: 0px 30px;
	}

	& .product-card-info a {
		font-size: 20px;
		font-weight: 400;
		color: black;
	}

	& .product-card-info a:hover {
		text-decoration: none;
		color: red;
		transition: 0.3s;
	}

	& .product-card-info label input {
		margin: 20px -75px 0 -53px;
	}

	& .product {
		background: #f1f1f1;
		width: 380px;
		height: 850px;
		margin: 5px;
		padding: 0px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		border-radius: 10px;
		position: relative;
	}

	& .product img {
		width: 380px;
		height: 380px;
		border-radius: 10px;
		object-fit: cover;
		margin: 0px 0 -150px;
	}

	& .input-price {
		width: 100%;
	}

	& input {
		width: 180px;
		margin: 10px auto 0 30px;
	}

	& .select-size {
		width: 180px;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #000000;
		margin: 10px 0px 0 30px;
		font-size: 18px;
		font-weight: 500;
	}
`;
