import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal } from "../../redux/reducers";
import { deletePhoto } from "../../utils";
import { Dispatch, SetStateAction } from "react";

export const useDeletePhoto = () => {

	const dispatch = useAppDispatch();

	return (photoUrl: string, isPageRefresh: boolean, setIsPageRefresh: Dispatch<SetStateAction<boolean>>) => dispatch(
		openModal({
			text: 'Удалить фото?',
			onConfirm: () => {
				deletePhoto(photoUrl)
				dispatch(closeModal());
				setIsPageRefresh(!isPageRefresh);
			},
			onCancel: () => dispatch(closeModal()),
		}),
	);
}
