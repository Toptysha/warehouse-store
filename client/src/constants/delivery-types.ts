import { DELIVERY_TYPE_OPTIONS } from "./delivery-type-options";

export const deliveryTypes = Object.values(DELIVERY_TYPE_OPTIONS).map((deliveryType) => ({ value: deliveryType, label: deliveryType }));
