import styled from 'styled-components';
import { Sale } from '../../../interfaces';
import { formatDateFromDb, trimmingText } from '../../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { OFFLINE_DEAL } from '../../../constants';

export const SalesRow = ({ sale }: { sale: Sale }) => {
	const navigate = useNavigate();

	const handleRowClick = (e: React.MouseEvent) => {
		if (!(e.target as HTMLElement).closest('a')) {
			navigate(`/sales/${sale.id}`);
		}
	};

	const isOfflineDeal = sale.address === OFFLINE_DEAL && sale.name === OFFLINE_DEAL;

	return (
		<SalesRowContainer onClick={handleRowClick}>
			<div className="infoPoint">{isOfflineDeal ? 'Магазин' : sale.name}</div>
			<div className="infoPoint">{isOfflineDeal ? 'Магазин' : sale.phone}</div>
			<div className="infoPoint">{isOfflineDeal ? 'Магазин' : trimmingText(sale.address, 10)}</div>
			<div className="infoPoint">{isOfflineDeal ? 'Магазин' : sale.deliveryType}</div>
			<div className="infoPoint">
				<Link to={`/catalog/${sale.product.productId}`}>{sale.product.productArticle}</Link>
			</div>
			<div className="infoPoint">{sale.product.price}</div>
			<div className="infoPoint">{formatDateFromDb(sale.createdAt)}</div>
			<div className="infoPoint">{sale.authorId}</div>
		</SalesRowContainer>
	);
};

const SalesRowContainer = styled.div`
	cursor: pointer;
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
	font-size: 14px;
	font-weight: 400;

	& .infoPoint {
		// background-color: red;
		// border: 1px solid black;
		position: relative;
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	& .infoPoint a {
		text-decoration: none;
		color: #000;
	}

	& .infoPoint a:hover {
		color: red;
		transition: 0.3s;
	}

	& select {
		height: 25px;
		border-radius: 5px;
		padding-left: 5px;
	}

	& .infoPoint button {
		right: -15px;
		position: absolute;
		background: none;
		border: none;
	}
`;
