import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { logout, openLoader } from '../../redux/reducers';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS, COLORS, ROLE } from '../../constants';
import hangerLogo from '../../images/hanger-logo.png';
import beautyLogo from '../../images/beauty-logo.png';
import arrowsDown from '../../images/arrows.png';
import styled from 'styled-components';
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

	const onClick = () => {
		dispatch(openLoader());
		setIsVisible(false);
	};

	const onLogout = () => {
		request('/logout', 'POST').then(() => {
			dispatch(logout());
			setIsVisible(false);
		});
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
							<Link to="/account_exchange">
								<div onClick={onClick}>Управление аккаунтом</div>
							</Link>
							{ACCESS.USERS.includes(user.roleId as string) && (
								<Link to="/users">
									<div onClick={onClick}>Управление пользователями</div>
								</Link>
							)}
							{ACCESS.EDIT_SCHEDULES.includes(user.roleId as string) && (
								<Link to="/schedule">
									<div onClick={onClick}>График работы продавцов</div>
								</Link>
							)}
							{ACCESS.LOGS.includes(user.roleId as string) && (
								<Link to="/logs">
									<div onClick={onClick}>Журнал действий</div>
								</Link>
							)}
							<Link to="/login">
								<div onClick={onLogout}>Выйти</div>
							</Link>
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
		width: 200px;
		position: absolute;
		right: 0;
		top: 60px;
		background: #fefefe;
		font-size: 14px;
		text-align: right;
	}

	& .name-menu a {
		background: red;
		text-decoration: none;
		color: #000;
	}

	& .name-menu div {
		cursor: pointer;
		padding: 5px;
	}

	& .name-menu div:hover {
		background: ${COLORS.HEADER};
	}
`;
