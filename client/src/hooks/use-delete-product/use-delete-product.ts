import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal } from "../../redux/reducers";
import { deleteProduct } from "../../utils";
import { Dispatch, SetStateAction } from "react";

export const useDeleteProduct = () => {

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return (id: string, route: string, needRefreshPage?:boolean, setNeedRefreshPage?: Dispatch<SetStateAction<boolean>>) => dispatch(
		openModal({
			text: 'Удалить товар?',
			onConfirm: () => {
				deleteProduct(id);
				dispatch(closeModal());
				navigate(route);
				setNeedRefreshPage && setNeedRefreshPage(!needRefreshPage)
			},
			onCancel: () => dispatch(closeModal()),
		}),
	);
}
