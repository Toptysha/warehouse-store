import styled from 'styled-components';
import { Button, Input, InputMask, Loader, PrivateContent } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp, selectUser } from '../../redux/selectors';
import { ACCESS, ROLE } from '../../constants';
import { useEffect, useState } from 'react';
import { phoneFormat, request } from '../../utils';
import { useAppDispatch } from '../../redux/store';
import { closeLoader } from '../../redux/reducers';

export const AccountExchange = () => {
	const [newInfo, setNewInfo] = useState({ login: '', phone: '', oldPass: '', newPass: '', newPassAgain: '' });
	const [message, setMessage] = useState({ text: '', color: 'none' });
	const [isViewMessage, setIsViewMessage] = useState(false);
	const [loader, setLoader] = useState(useSelector(selectApp).loader);

	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);

	const showMessage = () => {
		setIsViewMessage(true);
		setTimeout(() => {
			setIsViewMessage(false);
		}, 2000);
	};

	useEffect(() => {
		if (user.roleId === ROLE.GUEST) {
			setTimeout(() => {
				dispatch(closeLoader());
				setLoader(false);
			}, 400);
		} else {
			dispatch(closeLoader());
			setLoader(false);
		}
	}, [user, dispatch]);

	const onSaveInfo = () => {
		if (newInfo.oldPass) {
			if (newInfo.newPass && newInfo.newPass !== newInfo.newPassAgain) {
				setMessage({ text: 'Пароли не совпадают!', color: '#b00' });
				showMessage();
				return;
			}
			const postData = {
				id: user.id,
				oldPass: newInfo.oldPass,
				...(newInfo.login && { login: newInfo.login }),
				...(newInfo.phone && { phone: phoneFormat(newInfo.phone) }),
				...(newInfo.newPass && newInfo.newPass === newInfo.newPassAgain && { newPass: newInfo.newPass }),
			};
			request(`/users/change_main_info`, 'POST', postData).then(({ error, data }) => {
				if (error) {
					setMessage({ text: error, color: '#b00' });
					showMessage();
					return;
				}
				setMessage({ text: data ? 'Данные успешно сохранены!' : 'Неверный пароль!', color: data ? '#0b0' : '#b00' });
				showMessage();
			});
		} else {
			setMessage({ text: 'Введите пароль!', color: '#b00' });
			showMessage();
			return;
		}
	};

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.AUTH}>
			<AccountExchangeContainer>
				<h2>Для любых изменений надо ввести пароль!</h2>
				<div className="points">
					Пароль:
					<div className="new-info-line">
						<Input
							width="300px"
							type="password"
							placeholder="Пароль..."
							onChange={(target: any) => {
								setNewInfo({ ...newInfo, oldPass: target.target.value });
							}}
						/>
					</div>
				</div>
				<div className="points">
					Новый Логин:
					<div className="new-info-line">
						<Input
							width="300px"
							placeholder="Логин..."
							onChange={(target: any) => {
								setNewInfo({ ...newInfo, login: target.target.value });
							}}
						/>
					</div>
				</div>
				<div className="points">
					Новый номер телефона:
					<div className="new-info-line">
						<InputMask
							placeholder="Номер телефона..."
							width="300px"
							onChange={(target: any) => {
								setNewInfo({ ...newInfo, phone: target.target.value });
							}}
						/>
					</div>
				</div>
				<div className="points">
					Новый пароль:
					<div className="new-info-line">
						<Input
							width="300px"
							placeholder="Пароль..."
							type="password"
							onChange={(target: any) => {
								setNewInfo({ ...newInfo, newPass: target.target.value });
							}}
						/>
					</div>
				</div>
				<div className="points">
					Подтвердить новый пароль:
					<div className="new-info-line">
						<Input
							width="300px"
							placeholder="Пароль..."
							type="password"
							onChange={(target: any) => {
								setNewInfo({ ...newInfo, newPassAgain: target.target.value });
							}}
						/>
					</div>
				</div>
				<Button description="Сохранить изменения" width="300px" onClick={onSaveInfo} disabled={false} />
				{isViewMessage && <MessageContainer $color={message.color}>{message.text}</MessageContainer>}
			</AccountExchangeContainer>
		</PrivateContent>
	);
};

const AccountExchangeContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: start;
	width: 1100px;
	margin: 0 auto 40px;
	position: relative;

	& h2 {
		margin: 0 0 40px;
	}

	& .points {
		width: 100%;
		height: 100px;
		text-align: center;
		margin: 0 0 20px;
	}

	& .new-info-line {
		display: flex;
		width: 350px;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
	}
`;

const MessageContainer = styled.div<{ $color: string }>`
	background: ${({ $color = 'none' }) => $color};
	position: absolute;
	top: 170px;
	width: 350px;
	height: 100px;
	border-radius: 15px;
	font-size: 24px;
	font-weight: 500;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
`;
