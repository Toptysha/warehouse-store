import styled from 'styled-components';
import { SellerStats } from '../../../interfaces';

export const SellersRow = ({ seller }: { seller: SellerStats }) => {
	return Number(seller.lastMonthProductsAmount) !== 0 || Number(seller.currentMonthProductsAmount) !== 0 ? (
		<SellersRowContainer>
			<div className="infoPoint">{seller.seller}</div>
			<div className="infoPoint">{seller.currentMonthRevenueAmount}</div>
			<div className="infoPoint">{seller.lastMonthRevenueAmount}</div>
			<div className="infoPoint">{seller.currentMonthProductsAmount}</div>
			<div className="infoPoint">{seller.lastMonthProductsAmount}</div>
			<div className="infoPoint">{seller.currentMonthWage}</div>
			<div className="infoPoint">{seller.lastMonthWage}</div>
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
