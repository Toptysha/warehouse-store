import styled from 'styled-components';
import { SellerStats } from '../../../interfaces';

export const SellersRow = ({ seller, sellType }: { seller: SellerStats; sellType: 'all' | 'online' | 'offline' }) => {
	return seller.offlineWageInCurrentMonth !== 0 || seller.offlineWageInLastMonth !== 0 || seller.onlineWageInCurrentMonth !== 0 || seller.onlineWageInLastMonth !== 0 ? (
		<SellersRowContainer>
			<div className="infoPoint">{seller.sellerName}</div>
			<div className="infoPoint">
				{sellType === 'all'
					? seller.totalOfflinePriceInCurrentMonth + seller.totalOnlinePriceInCurrentMonth
					: sellType === 'online'
						? seller.totalOnlinePriceInCurrentMonth
						: seller.totalOfflinePriceInCurrentMonth}
			</div>
			<div className="infoPoint">
				{sellType === 'all'
					? seller.totalOfflinePriceInLastMonth + seller.totalOnlinePriceInLastMonth
					: sellType === 'online'
						? seller.totalOnlinePriceInLastMonth
						: seller.totalOfflinePriceInLastMonth}
			</div>
			<div className="infoPoint">
				{sellType === 'all'
					? seller.totalOfflineProductsInCurrentMonth + seller.totalOnlineProductsInCurrentMonth
					: sellType === 'online'
						? seller.totalOnlineProductsInCurrentMonth
						: seller.totalOfflineProductsInCurrentMonth}
			</div>
			<div className="infoPoint">
				{sellType === 'all'
					? seller.totalOfflineProductsInLastMonth + seller.totalOnlineProductsInLastMonth
					: sellType === 'online'
						? seller.totalOnlineProductsInLastMonth
						: seller.totalOfflineProductsInLastMonth}
			</div>
			<div className="infoPoint">
				{sellType === 'all'
					? seller.offlineWageInCurrentMonth + seller.onlineWageInCurrentMonth
					: sellType === 'online'
						? seller.onlineWageInCurrentMonth
						: seller.offlineWageInCurrentMonth}
			</div>
			<div className="infoPoint">
				{sellType === 'all' ? seller.offlineWageInLastMonth + seller.onlineWageInLastMonth : sellType === 'online' ? seller.onlineWageInLastMonth : seller.offlineWageInLastMonth}
			</div>
		</SellersRowContainer>
	) : null;
};

const SellersRowContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 50px;
	background-color: #f2f2f2;
	border-radius: 10px;
	margin-bottom: 10px;
	padding: 0 20px;
	box-sizing: border-box;
	font-size: 16px;
	font-weight: 400;

	& .infoPoint {
		// background-color: red;
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
