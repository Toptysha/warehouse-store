import styled from 'styled-components';
import { Table } from '../../components';
import { useEffect, useState } from 'react';
import { request } from '../../utils';
import { ActionLog } from '../../interfaces';
import { LogsRow } from './components';
import { LOG_ACTIONS } from '../../constants';

export const Logs = () => {
	const [logsByOrders, setLogsByOrders] = useState<ActionLog[]>([]);
	const [logsByProducts, setLogsByProducts] = useState<ActionLog[]>([]);
	const [logsByUsers, setLogsByUsers] = useState<ActionLog[]>([]);
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const switcherNames = ['Продажи', 'Товары', 'Пользователи'];

	useEffect(() => {
		request(`/logs`).then(({ error, data }) => {
			if (error) {
				console.log(error);
			} else {
				let orderLogs: ActionLog[] = [];
				let productLogs: ActionLog[] = [];
				let userLogs: ActionLog[] = [];

				data.forEach((log: ActionLog) => {
					if (Object.values(LOG_ACTIONS.ORDER_ACTIONS).includes(log.action)) {
						orderLogs.push(log);
					} else if (Object.values(LOG_ACTIONS.PRODUCT_ACTIONS).includes(log.action)) {
						productLogs.push(log);
					} else if (Object.values(LOG_ACTIONS.USER_ACTIONS).includes(log.action)) {
						userLogs.push(log);
					}
				});
				setLogsByOrders(orderLogs);
				setLogsByProducts(productLogs);
				setLogsByUsers(userLogs);
			}
		});
	}, []);

	return (
		<LogsContainer>
			<Table
				headers={['Журнал действий']}
				$headerFontSize="18px"
				tablePoints={[
					logsByOrders.map((log, index) => <LogsRow key={index} log={log} />),
					logsByProducts.map((log, index) => <LogsRow key={index} log={log} />),
					logsByUsers.map((log, index) => <LogsRow key={index} log={log} />),
				]}
				isSwitcher={true}
				isSearch={false}
				switcherArgs={{ position: switcherPosition, setPosition: setSwitcherPosition, positionNames: switcherNames }}
			/>
		</LogsContainer>
	);
};

const LogsContainer = styled.div`
	width: 1100px;
	min-height: 80vh;
	margin: 0 auto;
	padding: 10px;
`;
