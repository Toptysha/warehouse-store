import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal } from "../../redux/reducers";
import { deleteProduct } from "../../utils";

export const useDeleteProduct = () => {

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	return (id: string, route: string) => dispatch(
		openModal({
			text: 'Удалить товар?',
			onConfirm: () => {
				deleteProduct(id);
				dispatch(closeModal());
				navigate(route);
			},
			onCancel: () => dispatch(closeModal()),
		}),
	);
}
