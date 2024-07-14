import { useEffect, useState } from 'react';
import { closeLoader } from '../../redux/reducers';
import { request } from '../../utils';
import { Order} from '../../interfaces';
import { OFFLINE_DEAL, PAGINATION_LIMIT } from '../../constants';
import { useAppDispatch } from '../../redux/store';

interface APIResponse<T> {
    error: string | null;
    data: T;
}

export const useOrders = (searchPhrase: string, page: number) => {
    const [orders, setOrders] = useState<Order[]>([]);
	const [lastPage, setLastPage] = useState(1);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response: APIResponse<{ orders: Order[], lastPage: number }> = await request(`/orders?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`);
                const { error, data } = response;
                if (error) {
                    console.error(error);
                    dispatch(closeLoader());
                } else {
					const ordersWithoutReturns = data.orders.filter(({product}) => product[product.length - 1][0].productId !== null)
                    setOrders(ordersWithoutReturns);
					setLastPage(data.lastPage);
                }
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(closeLoader());
            }
        };

        fetchOrders();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, page, searchPhrase]);

	const { ordersOnline, ordersOffline } = orders.reduce<{
		ordersOnline: Order[];
		ordersOffline: Order[];
	}>(
		(acc, order) => {
			if (order.name !== OFFLINE_DEAL && order.phone !== OFFLINE_DEAL) {
				acc.ordersOnline.push(order);
			} else if (order.name === OFFLINE_DEAL && order.phone === OFFLINE_DEAL) {
				acc.ordersOffline.push(order);
			}
			return acc;
		},
		{ ordersOnline: [], ordersOffline: [] },
	);

    return { orders, ordersOnline, ordersOffline, lastPage };
};
