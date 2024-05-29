import styled from 'styled-components';
import { Sale } from '../../../interfaces';

export const SalesRow = ({ sale }: { sale: Sale }) => {
	// const currentUser = useSelector(selectUser);

	return (
		<SalesRowContainer>
			<div className="infoPoint">{sale.name}</div>
			<div className="infoPoint">{sale.phone}</div>
			<div className="infoPoint">{sale.address.length > 12 ? sale.address.slice(0, 10) + '...' : sale.address}</div>
			<div className="infoPoint">{sale.delivery}</div>
			<div className="infoPoint">{sale.product.productId}</div>
			<div className="infoPoint">{sale.authorId}</div>
		</SalesRowContainer>
	);
};

const SalesRowContainer = styled.div`
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
	font-size: 18px;
	font-weight: 400;

	& .infoPoint {
		// background-color: red;
		position: relative;
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		// border: 1px solid black;
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
