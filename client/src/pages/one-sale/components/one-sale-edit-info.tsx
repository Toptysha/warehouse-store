import styled from 'styled-components';
import { Button, Input, InputMask } from '../../../components';
import { Order, OrderInfoExchangeType, ReactSelectOptionType, UpdateOrderInfo } from '../../../interfaces';
import Select, { SingleValue } from 'react-select';
import { formatDateFromDb, phoneFormat, reactSelectStyles } from '../../../utils';
import { deliveryTypes } from '../../../constants';
import { Dispatch, SetStateAction } from 'react';

export const OneSaleEditInfo = ({
	order,
	newOrderInfo,
	setNewOrderInfo,
	setExchangeType,
	setIsNewOrderInfo,
}: {
	order: Order;
	newOrderInfo: UpdateOrderInfo;
	setNewOrderInfo: Dispatch<SetStateAction<UpdateOrderInfo>>;
	setExchangeType: Dispatch<SetStateAction<OrderInfoExchangeType>>;
	setIsNewOrderInfo: Dispatch<SetStateAction<boolean>>;
}) => {
	const handleChangeInfo = (key: string, value: string) => {
		if (key === 'phone') {
			const updatePhone = phoneFormat(value);
			setNewOrderInfo((prev) => ({
				...prev,
				[key]: updatePhone,
			}));
		} else {
			setNewOrderInfo((prev) => ({
				...prev,
				[key]: value,
			}));
		}
	};

	return (
		<OneSaleEditInfoContainer>
			<div className="buttons">
				<Button
					description={`Сохранить информацию`}
					width="200px"
					onClick={() => {
						setExchangeType('saveInfo');
					}}
				/>
				<Button
					description={`Отмена`}
					width="80px"
					onClick={() => {
						setIsNewOrderInfo(false);
						setNewOrderInfo({
							name: order ? order.name : '',
							address: order ? order.name : '',
							deliveryType: order ? order.deliveryType : '',
							deliveryPrice: order ? order.deliveryPrice : '',
							phone: order ? order.phone : '',
						});
					}}
				/>
			</div>
			<div className="order-info">
				<p>
					Заказчик:{' '}
					<Input
						type="text"
						width="300px"
						value={newOrderInfo.name}
						placeholder={newOrderInfo.name}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeInfo('name', event.target.value)}
					/>
				</p>
				<p>
					Телефон:{' '}
					<InputMask placeholder={newOrderInfo.phone} width="300px" onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeInfo('phone', event.target.value)} />
				</p>
				<p>
					Адрес доставки:{' '}
					<Input
						type="text"
						width="300px"
						value={newOrderInfo.address}
						placeholder={newOrderInfo.address}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeInfo('address', event.target.value)}
					/>
				</p>
				<div className="delivery-info">
					Служба доставки:{' '}
					<Select
						className="select-products"
						value={newOrderInfo.deliveryType ? { value: newOrderInfo.deliveryType, label: newOrderInfo.deliveryType } : null}
						onChange={(option: SingleValue<ReactSelectOptionType>) => handleChangeInfo('deliveryType', option ? option.value : '')}
						options={deliveryTypes}
						isClearable
						isSearchable
						noOptionsMessage={() => 'Нет совпадений'}
						placeholder="Выберите службу доставки"
						styles={reactSelectStyles('200px')}
					/>
				</div>
				<p>
					Стоимость доставки:{' '}
					<Input
						type="number"
						width="300px"
						value={newOrderInfo.deliveryPrice}
						placeholder={newOrderInfo.deliveryPrice}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangeInfo('deliveryPrice', event.target.value)}
					/>
				</p>
				<p>
					Стоимость товаров: <span>{order?.totalPrice}</span>
				</p>
				<p>
					Дата: <span>{order && formatDateFromDb(order?.createdAt)}</span>
				</p>
				<p>
					Продавец: <span>{order.authorName}</span>
				</p>
			</div>
		</OneSaleEditInfoContainer>
	);
};

const OneSaleEditInfoContainer = styled.div``;
