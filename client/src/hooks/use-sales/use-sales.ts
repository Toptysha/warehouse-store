import { useEffect, useState } from 'react';
import { closeLoader } from '../../redux/reducers';
import { request } from '../../utils';
import { Order, Sale } from '../../interfaces';
import { PAGINATION_LIMIT } from '../../constants';
import { useAppDispatch } from '../../redux/store';

interface APIResponse<T> {
    error: string | null;
    data: T;
}

interface User {
    id: string;
    login: string;
}

export const useSales = (searchPhrase: string, page: number) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
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
                    setOrders(data.orders);
					setLastPage(data.lastPage);
                    const formedSales: Sale[] = [];

                    data.orders.forEach((order) => {
                        order.product.forEach((prod) => {
                            const { product, ...rest } = order;
                            formedSales.push({ ...rest, product: prod });
                        });
                    });

                    setSales(formedSales);

                    const salesWithAuthorNames = await Promise.all(
                        formedSales.map(async (sale) => {
                            try {
                                const userResponse: APIResponse<User> = await request(`/users/${sale.authorId}`);
                                if (userResponse.error) {
                                    console.error(userResponse.error);
                                    return sale;
                                } else {
                                    return { ...sale, authorId: userResponse.data.login };
                                }
                            } catch (error) {
                                console.error(error);
                                return sale;
                            }
                        })
                    );

                    const salesWithProductArticles = await Promise.all(
                        salesWithAuthorNames.map(async (sale) => {
                            try {
                                const productResponse = await request(`/products/${sale.product.productId}`);
                                if (productResponse.error) {
                                    console.error(productResponse.error);
                                    return sale;
                                } else {
                                    return { ...sale, product: { ...sale.product, productArticle: productResponse.data.product.article } };
                                }
                            } catch (error) {
                                console.error(error);
                                return sale;
                            }
                        })
                    );
                    setSales(salesWithProductArticles);
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

    return { orders, sales, lastPage };
};
