import styled from 'styled-components';
import { Loader, PrivateContent, Table } from '../../components';
import { ACCESS } from '../../constants';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useEffect, useState } from 'react';
import { getDaysInMonth, request, totalSellersStatsCount, totalStatsCount } from '../../utils';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';
import { SellersRow, TotalInfoBlock } from './components';
import { SellerStats, TotalStats } from '../../interfaces';

export const SalesStats = () => {
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const [sellersStatsAmount, setSellersStatsAmount] = useState<SellerStats[]>([]);
	const [totalStatsAmount, setTotalStatsAmount] = useState<TotalStats>();

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();

	const switcherNames = ['Все продажи', 'Продажи онлайн', 'Продажи в магазине'];

	const tableHeaders = [
		'Продавец',
		'Cумма продаж в текущем месяце',
		'Cумма продаж в прошлом месяце',
		'Товаров продано в текущем месяце',
		'Товаров продано в прошлом месяце',
		'ЗП в текущем месяце(%)',
		'ЗП в прошлом месяце(%)',
	];

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

				const lastDate = {
					year: currentMonth === 1 ? currentYear - 1 : currentYear,
					month: currentMonth === 1 ? 12 : currentMonth - 1,
				};

				const daysInMonth = {
					currentMonth: getDaysInMonth(currentYear, currentMonth).length,
					lastMonth: getDaysInMonth(lastDate.year, lastDate.month).length,
				};

				const sellerStatsPromises = [
					request(`/users/by_roles`, 'POST', { roleIds: ACCESS.MAKE_ORDER }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfCurrentMonth, endDate: formattedDateNow }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfLastMonth, endDate: formattedFirstDayOfCurrentMonth }),
					request(`/schedule/find_by_month`, 'POST', { year: currentYear, month: currentMonth + 1 }),
					request(`/schedule/find_by_month`, 'POST', { year: lastDate.year, month: lastDate.month + 1 }),
				];

				const [users, ordersByCurrentMonth, ordersByLastMonth, scheduleByCurrentMonth, scheduleByLastMonth] = await Promise.all(sellerStatsPromises);

				const allSellersStats = totalSellersStatsCount(
					users.data,
					ordersByCurrentMonth.data,
					ordersByLastMonth.data,
					scheduleByCurrentMonth.data,
					scheduleByLastMonth.data,
					daysInMonth,
				);

				setSellersStatsAmount(allSellersStats as SellerStats[]);
				setTotalStatsAmount(totalStatsCount(allSellersStats as SellerStats[]));
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				dispatch(closeLoader());
			}
		};

		fetchSellerStats();
	}, [dispatch, currentMonth, currentYear]);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.WATCH_SALE_STATS}>
			<SalesStatsContainer>
				{totalStatsAmount && (
					<>
						<Table
							headers={tableHeaders}
							$headerFontSize="14px"
							tablePoints={[
								sellersStatsAmount.map((seller) => <SellersRow key={seller.sellerId} seller={seller} sellType="all" />),
								sellersStatsAmount.map((seller) => <SellersRow key={seller.sellerId} seller={seller} sellType="online" />),
								sellersStatsAmount.map((seller) => <SellersRow key={seller.sellerId} seller={seller} sellType="offline" />),
							]}
							isSwitcher={true}
							isSearch={false}
							switcherArgs={{ position: switcherPosition, setPosition: setSwitcherPosition, positionNames: switcherNames }}
						/>
						<TotalInfoBlock totalAmount={totalStatsAmount} switcherPosition={switcherPosition} />
					</>
				)}
			</SalesStatsContainer>
		</PrivateContent>
	);
};

const SalesStatsContainer = styled.div`
	min-height: 80vh;
`;
