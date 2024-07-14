import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal } from "../../redux/reducers";
import { deleteOrder } from "../../utils";
import { Dispatch, SetStateAction } from "react";

export const useDeleteOrder = () => {

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return (id: string, route: string, needRefreshPage?:boolean, setNeedRefreshPage?: Dispatch<SetStateAction<boolean>>) => dispatch(
		openModal({
			text: 'Сделать возврат товаров?',
			onConfirm: () => {
				deleteOrder(id);
				dispatch(closeModal());
				navigate(route);
				setNeedRefreshPage && setNeedRefreshPage(!needRefreshPage)
			},
			onCancel: () => dispatch(closeModal()),
		}),
	);
}
