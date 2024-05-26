import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { logout, openLoader } from '../../redux/reducers';
import { useNavigate } from 'react-router-dom';
import { COLORS, ROLE } from '../../constants';
import hangerLogo from '../../images/hanger-logo.png';
import beautyLogo from '../../images/beauty-logo.png';
import arrowsDown from '../../images/arrows.png';
import styled from 'styled-components';
import { NameMenuPoint } from './components';
import { request } from '../../utils';
import { useEffect, useRef, useState } from 'react';

export const Header = () => {
	const [isVisible, setIsVisible] = useState(false);
	const divRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (divRef.current && !divRef.current.contains(event.target as Node)) {
			setIsVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, []);

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const user = useSelector(selectUser);

	const onLogout = () => {
		navigate('/login');
		request('/logout', 'POST').then(() => {
			dispatch(logout());
			setIsVisible(false);
		});
	};

	const onUsers = () => {
		dispatch(openLoader());
		setIsVisible(false);
		navigate('/users');
	};

	return user.roleId !== ROLE.GUEST ? (
		<HeaderContainer>
			<div className="content-block">
				<div className="logos" onClick={() => navigate('/')}>
					<img className="hanger-logo" src={hangerLogo} alt="hanger-logo" />
					<img className="beauty-logo" src={beautyLogo} alt="beautyLogo" />
				</div>
				<div className="name-block-wrapper">
					<div className="name-block" onClick={() => setIsVisible(true)}>
						<h2>{user.login}</h2>
						<img className="arrows-down" src={arrowsDown} alt="arrows" />
					</div>
					{isVisible && (
						<div className="name-menu" ref={divRef}>
							<NameMenuPoint onClick={() => {}} description="Управление аккаунтом" />
							<NameMenuPoint onClick={onUsers} description="Управление пользователями" />
							<NameMenuPoint onClick={() => {}} description="Логи" />
							<NameMenuPoint onClick={onLogout} description="Выйти" />
						</div>
					)}
				</div>
			</div>
		</HeaderContainer>
	) : (
		<></>
	);
};

const HeaderContainer = styled.div`
	background: ${COLORS.HEADER};
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 60px;
	z-index: 10;

	& .logos {
		cursor: pointer;
	}

	& .hanger-logo {
		width: 55px;
		height: 40px;
		margin: 10px;
	}

	& .beauty-logo {
		width: 290px;
		height: 40px;
		margin: 10px;
	}

	& .name-block-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	& .name-block {
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 5px;
		margin-top: -5px;
	}

	& .arrows-down {
		width: 8px;
		height: 8px;
		margin: 10px;
	}

	& .content-block {
		display: flex;
		justify-content: space-between;
		width: 1100px;
		height: 100%;
		margin: 0 auto;
	}

	& .name-menu {
		position: absolute;
		right: 0;
		top: 60px;
		background: #fefefe;
		font-size: 14px;
	}

	& .name-menu div:hover {
		background: ${COLORS.HEADER};
		cursor: pointer;
	}
`;
