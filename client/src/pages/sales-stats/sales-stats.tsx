import styled from 'styled-components';
import { Loader, PrivateContent, Table } from '../../components';
import { ACCESS } from '../../constants';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useEffect, useState } from 'react';
import { UnionTotalStats } from '../../interfaces';
import { request, totalStatsCount } from '../../utils';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';
import { SellersRow, TotalInfoBlock } from './components';

export const SalesStats = () => {
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const [totalStatsAmount, setTotalStatsAmount] = useState<UnionTotalStats>();

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

				const sellerStatsPromises = [
					request(`/users/by_roles`, 'POST', { roleIds: ACCESS.MAKE_ORDER }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfCurrentMonth, endDate: formattedDateNow }),
					request(`/orders/by_date`, 'POST', { startDate: formattedFirstDayOfLastMonth, endDate: formattedFirstDayOfCurrentMonth }),
				];

				const [users, ordersByCurrentMonth, ordersByLastMonth] = await Promise.all(sellerStatsPromises);

				setTotalStatsAmount(totalStatsCount(users.data, ordersByCurrentMonth.data, ordersByLastMonth.data));
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
				{totalStatsAmount && (
					<>
						<Table
							headers={tableHeaders}
							$headerFontSize="14px"
							tablePoints={[
								totalStatsAmount.allSellerStats.map((seller) => <SellersRow key={seller.seller} seller={seller} />),
								totalStatsAmount.onlineSellerStats.map((seller) => <SellersRow key={seller.seller} seller={seller} />),
								totalStatsAmount.offlineSellerStats.map((seller) => <SellersRow key={seller.seller} seller={seller} />),
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
