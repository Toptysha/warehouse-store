import * as yup from 'yup';
import { AuthFormError, Button, Input, InputMask, SelectedProductsForOrder } from '../../../components';
import { deliveryTypes } from '../../../constants';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { findProductsByArticle, reactSelectStyles, removeSizes, request } from '../../../utils';
import { ReactSelectOptionType, UpdatedProduct } from '../../../interfaces';
import Select, { SingleValue, InputActionMeta } from 'react-select';

const orderFormScheme = yup.object().shape({
	name: yup.string().required('Заполните имя заказчика'),
	address: yup.string().required('Заполните адрес пункта доставки'),
	deliveryPrice: yup.string().required('Укажите цену доставки'),
});

export const Order = ({ orderType }: { orderType: 'online' | 'offline' }) => {
	const [phone, setPhone] = useState('');
	const [selectedDeliveryType, setSelectedDeliveryType] = useState<SingleValue<string>>('');
	const [selectedProduct, setSelectedProduct] = useState<SingleValue<string>>('');
	const [articles, setArticles] = useState<ReactSelectOptionType[]>([{ value: '', label: '' }]);
	const [products, setProducts] = useState<UpdatedProduct[]>([]);
	const [viewError, setViewError] = useState<boolean>(false);

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			address: '',
			deliveryPrice: '',
		},
		resolver: yupResolver(orderFormScheme),
	});

	const handleInputChange = (inputValue: string, actionMeta: InputActionMeta) => {
		if (actionMeta.action === 'input-change') {
			findProductsByArticle(inputValue, setSelectedProduct, setArticles, setProducts);
		}
	};

	const onSubmit = async ({ name, address, deliveryPrice }: { name: string; address: string; deliveryPrice: string }) => {
		if (products.length === 0 || (!selectedDeliveryType && orderType === 'online') || (!phone && orderType === 'online') || products.filter(({ size }) => !!size).length === 0) {
			setViewError(true);
			setTimeout(() => setViewError(false), 2500);
			return;
		}

		let totalPrice = 0;

		products.forEach(({ price }) => {
			totalPrice += Number(price);
		});

		const orders = products
			.filter(({ size }) => !!size)
			.map(({ id, size, price }) => {
				return {
					product: id,
					size,
					price,
					createdAt: new Date().toISOString(),
				};
			});

		const phoneFormat = orderType === 'online' ? phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '') : 'offline';

		const deliveryType = orderType === 'online' ? selectedDeliveryType : 'offline';

		const orderData = {
			name,
			phone: phoneFormat,
			address,
			deliveryPrice,
			deliveryType,
			isExchange: false,
			orders: [orders],
			totalPrice: totalPrice.toString(),
		};

		try {
			const response = await request(`/orders`, 'POST', orderData);
			if (response.error) {
				console.log(response.error);
			} else {
				await removeSizes(products);
				navigate('/sales');
			}
		} catch (error) {
			console.log(error);
		}
	};

	let allErrors = {
		formError: errors?.name?.message || errors?.address?.message || errors?.deliveryPrice?.message,
		phoneError: !phone && viewError ? 'Введите номер телефона' : '',
		deliveryError: !selectedDeliveryType && viewError ? 'Выберите службу доставки' : '',
		productError: products.length === 0 && viewError ? 'Выберите товары' : '',
		validProductError: products.filter(({ size }) => !!size).length === 0 && viewError ? 'Выберите товары, существующие на складе' : '',
	};

	const error =
		orderType === 'online'
			? allErrors.formError || allErrors.phoneError || allErrors.deliveryError || allErrors.productError || allErrors.validProductError
			: allErrors.productError || allErrors.validProductError;

	return (
		<OrderContainer>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="order">
					{orderType === 'online' && (
						<>
							<div className="form-point">
								<div className="title">Имя заказчика:</div>
								<Input placeholder="Имя" width="300px" {...register('name')} />
							</div>
							<div className="form-point">
								<div className="title">Телефон заказчика:</div>
								<InputMask
									placeholder="Номер телефона..."
									width="300px"
									onChange={(target: any) => {
										setPhone(target.target.value);
									}}
								/>
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
									onChange={(option: SingleValue<ReactSelectOptionType>) => setSelectedDeliveryType(option ? option.value : '')}
									options={deliveryTypes}
									isClearable
									isSearchable
									noOptionsMessage={() => 'Нет совпадений'}
									placeholder="Выберите службу доставки"
									styles={reactSelectStyles('200px')}
								/>
							</div>
							<div className="form-point">
								<div className="title">Цена за доставку:</div>
								<Input type="number" placeholder="Цена за доставку" width="300px" {...register('deliveryPrice')} />
							</div>
						</>
					)}
					<div className="form-point">
						<div className="title">Заказ:</div>
						<Select
							className="select-products"
							value={selectedProduct ? { value: selectedProduct, label: selectedProduct } : null}
							onChange={(option: SingleValue<ReactSelectOptionType>) => findProductsByArticle(option ? option.value : '', setSelectedProduct, setArticles, setProducts)}
							onInputChange={handleInputChange}
							options={articles}
							isClearable
							isSearchable
							noOptionsMessage={() => 'Нет совпадений'}
							placeholder="Введите артикул товара"
							styles={reactSelectStyles('200px')}
						/>
					</div>
					<SelectedProductsForOrder products={products} setProducts={setProducts} />
					{error ? <AuthFormError>{error}</AuthFormError> : null}
					<div className="form-point">
						{orderType === 'online' ? (
							<Button className="reg-button" description="Оформить заказ" type="submit" disabled={!!error} />
						) : (
							<Button
								className="reg-button"
								description="Оформить заказ"
								onClick={() => onSubmit({ name: 'offline', address: 'offline', deliveryPrice: '0' })}
								disabled={!!error}
							/>
						)}
					</div>
				</div>
			</form>
		</OrderContainer>
	);
};

const OrderContainer = styled.div`
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

	& .form-point button {
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
`;
