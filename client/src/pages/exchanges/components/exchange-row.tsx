import styled from 'styled-components';
import { Order } from '../../../interfaces';
import { Link, useNavigate } from 'react-router-dom';
import { tableHeadersExchange } from '../../../constants';

export const ExchangeRow = ({ order, isReturned = false }: { order: Order; isReturned?: boolean }) => {
	const navigate = useNavigate();

	const handleRowClick = (e: React.MouseEvent) => {
		if (!(e.target as HTMLElement).closest('a')) {
			navigate(`/sales/${order.id}`);
		}
	};

	const orderWithTotalPrice = () => {
		let totalPrice = 0;

		order.product[order.product.length - 2].forEach(({ price }) => {
			totalPrice += Number(price);
		});

		return { ...order, totalPrice: totalPrice.toString() };
	};

	return (
		<ExchangeRowContainer onClick={handleRowClick}>
			{tableHeadersExchange(isReturned ? orderWithTotalPrice() : order, isReturned).map(({ value }, index) => (
				<div className="infoPoint" key={index}>
					{typeof value === 'string' ? (
						value
					) : (
						<div className="products-article">
							{value.map(({ id, article }) => (
								<div className="article" key={article}>
									<Link to={`/catalog/${id}`}>{article}</Link>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</ExchangeRowContainer>
	);
};

const ExchangeRowContainer = styled.div`
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
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		whitespace: 'pre-wrap';
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

	& .article {
		margin: 5px;
	}
`;
