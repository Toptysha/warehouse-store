import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal, setError } from "../../redux/reducers";
import { deleteProduct, request } from "../../utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ERROR } from "../../constants";

export const useDeleteProduct = (productId: string) => {
	const [isCanDeleted, setIsCanDeleted] = useState(true);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		request(`/orders/check_product_in_orders`, 'POST', {productId}).then(({error, data}) => {
			if (error) {
				console.log(error);
			} else {
				data && setIsCanDeleted(false)
			}
		});
	}, [productId])

	return (route: string, needRefreshPage?:boolean, setNeedRefreshPage?: Dispatch<SetStateAction<boolean>>) => {
		return isCanDeleted ?
		dispatch(
			openModal({
				text: 'Удалить товар?',
				onConfirm: () => {
					deleteProduct(productId);
					dispatch(closeModal());
					navigate(route);
					setNeedRefreshPage && setNeedRefreshPage(!needRefreshPage)
				},
				onCancel: () => dispatch(closeModal()),
			}),
		) :
		dispatch(setError(ERROR.IS_CANT_DELETE))
	}
}
