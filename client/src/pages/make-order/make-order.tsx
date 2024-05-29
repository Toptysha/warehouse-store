import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import * as yup from 'yup';
import { AuthFormError, Button, Input, Loader, PrivateContent } from '../../components';
import { selectUser } from '../../redux/selectors';
import { ACCESS, DELIVERY_TYPES } from '../../constants';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { closeLoader } from '../../redux/reducers';
import { request } from '../../utils';
import { Product } from '../../interfaces';
import Select, { SingleValue, InputActionMeta, StylesConfig } from 'react-select';

const orderFormScheme = yup.object().shape({
	name: yup.string().required('Заполните имя заказчика'),
	phone: yup.string().required('Заполните телефон заказчика'),
	address: yup.string().required('Заполните адрес пункта доставки'),
	deliveryPrice: yup
		.string()
		.required('Укажите цену доставки')
		.matches(/^[0-9]+$/, 'В цене должны быть указаны только цифры'),
});

interface OptionType {
	value: string;
	label: string;
}

interface UpdatedProduct extends Product {
	cover: string;
	newPrice: string;
	size: string;
}

export const MakeOrder = () => {
	const [content, setContent] = useState<JSX.Element>(<Loader />);
	const [selectedDeliveryType, setSelectedDeliveryType] = useState<SingleValue<string>>('');
	const [selectedProduct, setSelectedProduct] = useState<SingleValue<string>>('');
	const [articles, setArticles] = useState<OptionType[]>([{ value: '', label: '' }]);
	const [products, setProducts] = useState<UpdatedProduct[]>([]);

	const deliveryTypes = Object.values(DELIVERY_TYPES).map((deliveryType) => ({ value: deliveryType, label: deliveryType }));

	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			phone: '',
			address: '',
			deliveryPrice: '',
		},
		resolver: yupResolver(orderFormScheme),
	});

	const onFindProducts = (inputValue: SingleValue<string>) => {
		if (inputValue) {
			setSelectedProduct(inputValue);

			request(`/products/article`, 'POST', { partOfArticle: inputValue }).then(({ error, data }) => {
				if (error) {
					setArticles([{ value: 'no-match', label: 'Совпадений не найдено' }]);
				} else {
					setArticles(data.products.map((product: Product) => ({ value: product.article, label: product.article })));
					if (data.products.length === 1) {
						setProducts((prev) => [
							...prev,
							{
								...data.products[0],
								cover: data.coversUrls[0][data.products[0].id][0],
								newPrice: data.products[0].price,
								size: data.products[0].sizes[0],
							},
						]);
					}
				}
			});
		} else {
			setSelectedProduct('');
		}
	};

	const handleInputChange = (inputValue: string, actionMeta: InputActionMeta) => {
		if (actionMeta.action === 'input-change') {
			onFindProducts(inputValue);
		}
	};

	const onChangeSize = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
		let newProducts: UpdatedProduct[] = products.map((product) => {
			if (product.id === id) {
				return {
					...product,
					size: event.target.value,
				};
			}
			return product;
		});

		setProducts(newProducts);
	};

	const onSubmit = ({ name, phone, address, deliveryPrice }: { name: string; phone: string; address: string; deliveryPrice: string }) => {
		let totalPrice = Number(deliveryPrice);

		products.forEach(({ newPrice }) => {
			totalPrice += Number(newPrice);
		});

		const orders = products.map(({ id, size, newPrice }) => ({ product: id, size, price: newPrice }));

		const orderData = { name, phone, address, deliveryPrice, delivery: selectedDeliveryType, orders, totalPrice: totalPrice.toString() };
		console.log(orderData);

		request(`/orders`, 'POST', orderData).then(({ error }) => {
			if (error) {
				console.log(error);
			} else {
				navigate('/sales');
			}
		});
	};

	const customStyles: StylesConfig<OptionType, false> = {
		menu: (provided) => ({
			...provided,
			maxHeight: '200px',
			overflowY: 'auto',
		}),
	};

	const formError = errors?.name?.message || errors?.phone?.message || errors?.address?.message;

	useEffect(() => {
		const timer = setTimeout(() => {
			const newContent = (
				<PrivateContent access={ACCESS.MAKE_ORDER}>
					<MakeOrderContainer>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="order">
								<div className="form-point">
									<div className="title">Имя заказчика:</div>
									<Input placeholder="Имя" width="300px" {...register('name')} />
								</div>
								<div className="form-point">
									<div className="title">Телефон заказчика:</div>
									<Input placeholder="Телефон" width="300px" {...register('phone')} />
								</div>
								<div className="form-point">
									<div className="title">Адрес пункта доставки:</div>
									<Input placeholder="Адрес" width="300px" {...register('address')} />
								</div>
								<div className="form-point">
									<div className="title">Служба доставки:</div>
									<Select
										className="select-products"
										value={selectedDeliveryType ? { value: selectedDeliveryType, label: selectedDeliveryType } : null}
										onChange={(option: SingleValue<OptionType>) => setSelectedDeliveryType(option ? option.value : '')}
										options={deliveryTypes}
										isClearable
										isSearchable
										noOptionsMessage={() => 'Нет совпадений'}
										placeholder="Выберите службу доставки"
										styles={customStyles}
									/>
								</div>
								<div className="form-point">
									<div className="title">Цена за доставку:</div>
									<Input type="number" placeholder="Цена за доставку" width="300px" {...register('deliveryPrice')} />
								</div>
								<div className="form-point">
									<div className="title">Заказ:</div>
									<Select
										className="select-products"
										value={selectedProduct ? { value: selectedProduct, label: selectedProduct } : null}
										onChange={(option: SingleValue<OptionType>) => onFindProducts(option ? option.value : '')}
										onInputChange={handleInputChange}
										options={articles}
										isClearable
										isSearchable
										noOptionsMessage={() => 'Нет совпадений'}
										placeholder="Введите артикул товара"
										styles={customStyles}
									/>
								</div>
								<div className="products">
									{products.map((product) => (
										<div key={product.id} className="product">
											<Link to={`/catalog/${product.id}`}>
												<img src={product.cover} alt={'COVER'} />
											</Link>
											<div className="product-card-info">
												<p>{`Артикул: ${product.article}`}</p>
												<p>{`Бренд: ${product.brand}`}</p>
												<p>{`Наименование: ${product.name}`}</p>
												<p>{`Цвет: ${product.color}`}</p>
												<p>{`Цена: ${product.price}`}</p>
												<p>
													Размер: <Input type="number" width="100px" onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeSize(event, product.id)} />
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="form-point">
									<Button className="reg-button" description="Оформить заказ" type="submit" disabled={!!formError} />
								</div>
								{formError && <AuthFormError>{formError}</AuthFormError>}
							</div>
						</form>
					</MakeOrderContainer>
				</PrivateContent>
			);
			setContent(newContent);
			dispatch(closeLoader());
		}, 200);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, user.roleId, selectedDeliveryType, selectedProduct, articles, products]);

	return content;
};

const MakeOrderContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 0 auto;
	padding-top: 25px;
	min-height: 900px;

	& form {
		width: 100%;
		margin: 0 auto;
	}

	& select {
		width: 300px;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #000000;
		padding: 10px;
		margin: 10px 0;
	}

	& button {
		width: 300px;
		margin: 40px auto;
	}

	& .order {
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		width: 800px;
	}

	& .form-point {
		margin: 0 auto;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 100%;
	}

	& .title {
		width: 900px;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
	}

	& .select-products {
		width: 300px;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #000000;
		margin: 10px 0;
		font-size: 18px;
		font-weight: 500;
	}

	& .products {
		display: flex;
		flex-wrap: wrap;
		margin: 10px auto 0;
		width: 100%;
		max-height: 600px;
		overflow-y: auto;
	}

	& .product-card-info {
		width: 100%;
		margin: 5px;
	}

	& .product-card-info p {
		font-size: 20px;
		font-weight: 500;
		text-align: center;
	}

	& .product {
		background: #f1f1f1;
		width: 380px;
		margin: 5px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
	}

	& .product img {
		width: 380px;
		height: 380px;
		border-radius: 10px;
		object-fit: cover;
	}
`;
