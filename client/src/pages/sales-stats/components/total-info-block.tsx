import styled from 'styled-components';
import { TotalStats } from '../../../interfaces';

export const TotalInfoBlock = ({ totalAmount, switcherPosition }: { totalAmount: TotalStats; switcherPosition: number }) => {
	return switcherPosition === 0 ? (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount?.currentMonthTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount?.currentMonthTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount?.currentMonthTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount?.lastMonthTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount?.lastMonthTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount?.lastMonthTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
		</TotalInfoBlockContainer>
	) : switcherPosition === 1 ? (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount?.currentMonthOnlineSellsTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount?.currentMonthOnlineSellsTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount?.currentMonthOnlineSellersTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount?.lastMonthOnlineSellsTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount?.lastMonthOnlineSellsTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount?.lastMonthOnlineSellersTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
		</TotalInfoBlockContainer>
	) : (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount?.currentMonthOfflineSellsTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount?.currentMonthOfflineSellsTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount?.currentMonthOfflineSellersTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount?.lastMonthOfflineSellsTotalRevenueAmount} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount?.lastMonthOfflineSellsTotalProductsAmount} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount?.lastMonthOfflineSellersTotalWage} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
		</TotalInfoBlockContainer>
	);
};

const TotalInfoBlockContainer = styled.div`
	& .block-total-info {
		background-color: #f2f2f2;
		width: 1100px;
		height: 100%;
		margin: 0 auto 10px;
		padding: 0 0 10px;
		border-radius: 10px;
	}

	& .table-total-info {
		// background-color: #fff;
		width: 100%;
		height: 100%;
		margin: 10px 20px 0;
		font-size: 17px;
	}
`;
