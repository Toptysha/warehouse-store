import { ROLE } from '../../constants';
import { useSelector } from 'react-redux';
import { selectApp, selectUser } from '../../redux/selectors';
import { Registration } from '../registration/registration';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';
import cover1 from '../../images/cover1.jpg';
import cover2 from '../../images/cover2.jpg';
import cover3 from '../../images/cover3.jpg';
import cover4 from '../../images/cover4.jpg';
import styled from 'styled-components';
import { BlockContent } from './components';
import { useEffect, useState } from 'react';
import { Loader } from '../../components';
import { useNavigate } from 'react-router-dom';

export const Main = () => {
	const [content, setContent] = useState<JSX.Element>(<Loader />);

	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const loader = useSelector(selectApp).loader;

	const navigate = useNavigate();

	const onClick = (path: string) => {
		navigate(path);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			const newContent =
				user.roleId !== ROLE.GUEST ? (
					<MainContainer>
						<BlockContent srcCover={cover1} description="Каталог товаров" onClick={() => onClick('/catalog')} />
						<BlockContent srcCover={cover2} description="Оформить заказ" onClick={() => onClick('/order')} />
						<BlockContent srcCover={cover3} description="Возвраты/обмены" onClick={() => onClick('/exchanges')} />
						<BlockContent srcCover={cover4} description="Продажи" onClick={() => onClick('/sales')} />
					</MainContainer>
				) : (
					<Registration />
				);
			setContent(newContent);
			dispatch(closeLoader());
		}, 500);

		return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, user.roleId]);

	return loader ? <Loader /> : content;
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
