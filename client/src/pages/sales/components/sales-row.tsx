import styled from 'styled-components';
import { Order } from '../../../interfaces';
import { Link, useNavigate } from 'react-router-dom';
import { OFFLINE_DEAL } from '../../../constants';
import { tableHeadersSale } from '../../../constants/table-headers-sale';

export const SalesRow = ({ order }: { order: Order }) => {
	const navigate = useNavigate();

	const handleRowClick = (e: React.MouseEvent) => {
		if (!(e.target as HTMLElement).closest('a')) {
			navigate(`/sales/${order.id}`);
		}
	};

	const isOfflineDeal = order.address === OFFLINE_DEAL && order.name === OFFLINE_DEAL;

	return (
		<SalesRowContainer onClick={handleRowClick}>
			{tableHeadersSale(order, isOfflineDeal).map(({ value }, index) => (
				<div className="infoPoint" key={index}>
					{typeof value === 'string' ? (
						value
					) : (
						<div className="products-article">
							{value.map(({ id, article }, index) => (
								<div className="article" key={article + index}>
									<Link to={`/catalog/${id}`}>{article}</Link>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</SalesRowContainer>
	);
};

const SalesRowContainer = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	min-height: 50px;
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

	& .article {
		margin: 5px;
	}
`;
