import styled from 'styled-components';
import { Button } from '../button/button';

export const DeleteLine = ({ onClick }: { onClick: () => void }) => {
	return (
		<DeleteLineContainer>
			<Button description="×" onClick={onClick} />
		</DeleteLineContainer>
	);
};

const DeleteLineContainer = styled.div`
	background: rgba(0, 0, 0, 0.3);
	position: absolute;
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	border-radius: 10px 10px 0 0;

	& button {
		background: #d60000;
		color: white;
		font-size: 30px;
		margin-right: 10px;
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 12px;
	}

	& button:hover {
		background: #c00000;
		color: #f0f0f0;
		transition: 0.3s;
	}
`;
