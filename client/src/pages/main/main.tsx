import { ROLE } from '../../constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import { Registration } from '../registration/registration';
import { useAppDispatch } from '../../redux/store';
import { setHeaderNameMenuDisplay } from '../../redux/reducers';
import cover1 from '../../images/cover1.jpg';
import cover2 from '../../images/cover2.jpg';
import cover3 from '../../images/cover3.jpg';
import cover4 from '../../images/cover4.jpg';
import styled from 'styled-components';
import { BlockContent } from './components';

export const Main = () => {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);

	return user.roleId !== ROLE.GUEST ? (
		<MainContainer onClick={() => dispatch(setHeaderNameMenuDisplay(false))}>
			<BlockContent srcCover={cover1} description="Каталог товаров" />
			<BlockContent srcCover={cover2} description="Оформить заказ" />
			<BlockContent srcCover={cover3} description="Возврат/обмен" />
			<BlockContent srcCover={cover4} description="Продажи" />
		</MainContainer>
	) : (
		<Registration />
	);
};

const MainContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 60px auto 0;
	padding-top: 25px;
	min-height: 900px;
`;
