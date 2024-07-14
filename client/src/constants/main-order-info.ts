import { UpdateOrderInfo } from "../interfaces";

export const mainOrderInfo = (newOrderInfo: UpdateOrderInfo) => {
	return [
		['Заказчик', newOrderInfo.name],
		['Телефон', newOrderInfo.phone],
		['Адрес доставки', newOrderInfo.address],
		['Служба доставки', newOrderInfo.deliveryType],
		['Стоимость доставки', newOrderInfo.deliveryPrice],
	]
}
