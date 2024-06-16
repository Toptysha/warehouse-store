import styled from 'styled-components';
import { Loader, PrivateContent, Switcher } from '../../components';
import { ACCESS } from '../../constants';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useEffect, useState } from 'react';
import { Order, SellerStats, User } from '../../interfaces';
import { request } from '../../utils';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';

export const SalesStats = () => {
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const [sellerStats, setSellerStats] = useState<SellerStats[]>([]);

	const switcherNames = ['Все продажи', 'Продажи онлайн', 'Продажи в магазине'];

	const loader = useSelector(selectApp).loader;

	const dispatch = useAppDispatch();

	useEffect(() => {
		const fetchSellerStats = async () => {
			try {
				const dateNow = new Date();
				const endDate = dateNow;
				endDate.setHours(endDate.getHours() + 3);

				const firstDayOfCurrentMonth = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
				firstDayOfCurrentMonth.setHours(firstDayOfCurrentMonth.getHours() + 3);

				const firstDayOfLastMonth = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1);
				firstDayOfLastMonth.setHours(firstDayOfLastMonth.getHours() + 3);

				const formattedFirstDayOfCurrentMonth = firstDayOfCurrentMonth.toISOString();
				const formattedDateNow = endDate.toISOString();
				const formattedFirstDayOfLastMonth = firstDayOfLastMonth.toISOString();

				const sellerStatsPromises = [
					request(`/users/by_roles`, 'POST', { roleIds: ACCESS.MAKE_ORDER }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfCurrentMonth, endDate: formattedDateNow }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfLastMonth, endDate: formattedFirstDayOfCurrentMonth }),
				];

				const [users, ordersByCurrentMonth, ordersByLastMonth] = await Promise.all(sellerStatsPromises);

				setSellerStats(
					users.data.map((user: User) => {
						let currentMonthRevenueAmount: number = 0;
						let lastMonthRevenueAmount: number = 0;
						let currentMonthProductsAmount: number = 0;
						let lastMonthProductsAmount: number = 0;

						ordersByCurrentMonth.data.forEach((order: Order) => {
							if (order.authorId === user.id) {
								currentMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
							}
						});
						ordersByLastMonth.data.forEach((order: Order) => {
							if (order.authorId === user.id) {
								lastMonthRevenueAmount += Number(order.totalPrice) - Number(order.deliveryPrice);
							}
						});
						ordersByCurrentMonth.data.forEach((order: Order) => {
							if (order.authorId === user.id) {
								currentMonthProductsAmount += order.product.length;
							}
						});
						ordersByLastMonth.data.forEach((order: Order) => {
							if (order.authorId === user.id) {
								lastMonthProductsAmount += order.product.length;
							}
						});

						return {
							seller: user.login,
							currentMonthRevenueAmount: `${currentMonthRevenueAmount}`,
							lastMonthRevenueAmount: `${lastMonthRevenueAmount}`,
							currentMonthProductsAmount: `${currentMonthProductsAmount}`,
							lastMonthProductsAmount: `${lastMonthProductsAmount}`,
							currentMonthWage: `${Math.round((currentMonthRevenueAmount / 100) * 3.5)}`,
							lastMonthWage: `${Math.round((lastMonthRevenueAmount / 100) * 3.5)}`,
						};
					}),
				);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				dispatch(closeLoader());
			}
		};

		fetchSellerStats();
	}, [dispatch]);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALE_STATS}>
			<SalesStatsContainer>
				<div className="switcher">
					<Switcher position={switcherPosition} setPosition={setSwitcherPosition} positionNames={switcherNames} />
				</div>
				<div className="sales">
					<div className="table-header">
						<div className="table-title">Продавец:</div>
						<div className="table-title">В текущем месяце сумма продаж:</div>
						<div className="table-title">В прошлом месяце сумма продаж:</div>
						<div className="table-title">В текущем месяце продано товаров:</div>
						<div className="table-title">В прошлом месяце продано товаров:</div>
						<div className="table-title">ЗП в текущем месяце:</div>
						<div className="table-title table-title-right-end">ЗП в прошлом месяце:</div>
					</div>
					{sellerStats.map((seller, index) => {
						if (index !== sellerStats.length - 1) {
							return (
								<div key={seller.seller} className="table-header">
									<div className="table-title">{seller.seller}</div>
									<div className="table-title">{seller.currentMonthRevenueAmount}</div>
									<div className="table-title">{seller.lastMonthRevenueAmount}</div>
									<div className="table-title">{seller.currentMonthProductsAmount}</div>
									<div className="table-title">{seller.lastMonthProductsAmount}</div>
									<div className="table-title">{seller.currentMonthWage}</div>
									<div className="table-title table-title-right-end">{seller.lastMonthWage}</div>
								</div>
							);
						} else {
							return (
								<div key={seller.seller} className="table-header">
									<div className="table-title table-title-bottom-end">{seller.seller}</div>
									<div className="table-title table-title-bottom-end">{seller.currentMonthRevenueAmount}</div>
									<div className="table-title table-title-bottom-end">{seller.lastMonthRevenueAmount}</div>
									<div className="table-title table-title-bottom-end">{seller.currentMonthProductsAmount}</div>
									<div className="table-title table-title-bottom-end">{seller.lastMonthProductsAmount}</div>
									<div className="table-title table-title-bottom-end">{seller.currentMonthWage}</div>
									<div className="table-title table-title-bottom-end table-title-right-end">{seller.lastMonthWage}</div>
								</div>
							);
						}
					})}
				</div>
			</SalesStatsContainer>
		</PrivateContent>
	);
};

const SalesStatsContainer = styled.div`
	// background-color: green;
	// display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 40px auto;
	min-height: 80vh;

	& .switcher {
		// background-color: #fff;
		width: 100%;
		display: flex;
		justify-content: center;
		height: 80px;
	}

	& .sales {
		// background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		margin: 20px auto 0;
		padding: 20px 0;
		background-color: #f2f2f2;
		border-radius: 10px;
	}

	& .table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 80px;
		padding: 0 20px;
		box-sizing: border-box;
		font-size: 16px;
		font-weight: 600;
	}

	& .table-sales {
		width: 100%;
		max-height: 70vh;
		overflow-y: auto;
	}

	& .table-title {
		width: 25%;
		height: 100%;
		padding: 0 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid black;
		border-bottom: 1px solid black;
	}

	& .table-title-right-end {
		border-right: none;
	}
	& .table-title-bottom-end {
		border-bottom: none;
	}
`;
