import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { closeModal, openModal, setError } from "../../redux/reducers";
import { deleteProduct, request } from "../../utils";
import { Dispatch, SetStateAction } from "react";
import { ERROR } from "../../constants";

export const useDeleteProduct = (productId: string) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return async (route: string, needRefreshPage?: boolean, setNeedRefreshPage?: Dispatch<SetStateAction<boolean>>) => {
        try {
            const { error, data } = await request(`/orders/check_product_in_orders`, 'POST', { productId });

            if (error) {
                console.log(error);
                dispatch(setError(ERROR.IS_CANT_DELETE));
                return;
            }

            const isCanDeleted = !data;

            if (isCanDeleted) {
                dispatch(
                    openModal({
                        text: 'Удалить товар?',
                        onConfirm: () => {
                            deleteProduct(productId);
                            dispatch(closeModal());
                            navigate(route);
                            setNeedRefreshPage && setNeedRefreshPage(!needRefreshPage);
                        },
                        onCancel: () => dispatch(closeModal()),
                    })
                );
            } else {
                dispatch(setError(ERROR.IS_CANT_DELETE));
            }
        } catch (err) {
            console.error(err);
            dispatch(setError(ERROR.IS_CANT_DELETE));
        }
    };
};
