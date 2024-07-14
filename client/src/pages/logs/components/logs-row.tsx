import styled from 'styled-components';
import { ActionLog } from '../../../interfaces';
import { LogActionMessage } from './log-action-message';

export const LogsRow = ({ log }: { log: ActionLog }) => {
	return (
		<LogsRowContainer>
			<LogActionMessage log={log} />
		</LogsRowContainer>
	);
};

const LogsRowContainer = styled.div`
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
