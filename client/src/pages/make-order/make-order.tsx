import { useAppDispatch } from '../../redux/store';
import { Loader, PrivateContent, Switcher } from '../../components';
import { ACCESS } from '../../constants';
import { useEffect, useState } from 'react';
import { closeLoader } from '../../redux/reducers';
import { Order } from './components';
import styled from 'styled-components';

export const MakeOrder = () => {
	const [content, setContent] = useState<JSX.Element>(<Loader />);
	const [switcherPosition, setSwitcherPosition] = useState(0);
	const switcherNames = ['Продажа онлайн', 'Продажа в магазине'];

	const dispatch = useAppDispatch();

	useEffect(() => {
		const timer = setTimeout(() => {
			const newContent = (
				<PrivateContent access={ACCESS.MAKE_ORDER}>
					<OrderContainer>
						<Switcher position={switcherPosition} setPosition={setSwitcherPosition} positionNames={switcherNames} />
						<Order orderType={switcherPosition === 0 ? 'online' : 'offline'} />
					</OrderContainer>
				</PrivateContent>
			);
			setContent(newContent);
			dispatch(closeLoader());
		}, 200);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, switcherPosition]);

	return content;
};

const OrderContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 0 auto;
`;
