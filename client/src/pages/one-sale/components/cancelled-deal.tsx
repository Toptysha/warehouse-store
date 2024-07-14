import styled from 'styled-components';
import { Button } from '../../../components';
import { Dispatch, SetStateAction } from 'react';
import { OrderInfoExchangeType } from '../../../interfaces';

export const CancelledDeal = ({ setExchangeType }: { setExchangeType: Dispatch<SetStateAction<OrderInfoExchangeType>> }) => {
	return (
		<CancelledDealContainer>
			<h2>Сделка отменена!</h2>
			<div className="buttons">
				<Button
					description={`Вернуть сделку!`}
					width="150px"
					onClick={() => {
						setExchangeType('cancelCancellation');
					}}
				/>
			</div>
		</CancelledDealContainer>
	);
};

const CancelledDealContainer = styled.div`
	background-color: rgba(255, 255, 255, 0.9);
	position: fixed;
	top: 40%;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 20%;
	text-align: center;
	font-size: 2rem;

	& h2 {
		margin-bottom: 2rem;
	}
`;
