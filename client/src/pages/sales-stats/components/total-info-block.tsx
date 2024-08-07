import styled from 'styled-components';
import { TotalStats } from '../../../interfaces';

export const TotalInfoBlock = ({ totalAmount, switcherPosition }: { totalAmount: TotalStats; switcherPosition: number }) => {
	return switcherPosition === 0 ? (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount.totalOfflinePriceInCurrentMonth + totalAmount.totalOnlinePriceInCurrentMonth} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount.totalOfflineProductsInCurrentMonth + totalAmount.totalOnlineProductsInCurrentMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount.offlineWageInCurrentMonth + totalAmount.onlineWageInCurrentMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount.totalOfflinePriceInLastMonth + totalAmount.totalOnlinePriceInLastMonth} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount.totalOfflineProductsInLastMonth + totalAmount.totalOnlineProductsInLastMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount.offlineWageInLastMonth + totalAmount.onlineWageInLastMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
		</TotalInfoBlockContainer>
	) : switcherPosition === 1 ? (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount.totalOnlinePriceInCurrentMonth} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount.totalOnlineProductsInCurrentMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount.onlineWageInCurrentMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount.totalOnlinePriceInLastMonth} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount.totalOnlineProductsInLastMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount.onlineWageInLastMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
		</TotalInfoBlockContainer>
	) : (
		<TotalInfoBlockContainer>
			<div className="block-total-info">
				<div className="table-total-info">
					В этом месяце продано на <b>{totalAmount.totalOfflinePriceInCurrentMonth} р.</b>
				</div>
				<div className="table-total-info">
					В этом месяце продано <b>{totalAmount.totalOfflineProductsInCurrentMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В этом месяце будет потрачено <b>{totalAmount.offlineWageInCurrentMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
				</div>
			</div>
			<div className="block-total-info">
				<div className="table-total-info">
					В прошлом месяце продано на <b>{totalAmount.totalOfflinePriceInLastMonth} р.</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце продано <b>{totalAmount.totalOfflineProductsInLastMonth} товаров</b>
				</div>
				<div className="table-total-info">
					В прошлом месяце было потрачено <b>{totalAmount.offlineWageInLastMonth} р. на ЗП</b> (посчитаны только проценты от продаж)
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
