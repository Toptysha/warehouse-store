import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { AuthFormError, Button, Input, InputMask } from '../../components';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLE } from '../../constants';
import { useAppDispatch } from '../../redux/store';
import { selectUser } from '../../redux/selectors';
import { setUser } from '../../redux/reducers';
import { request } from '../../utils';
import styled from 'styled-components';

const authFormScheme = yup.object().shape({
	password: yup.string().required('Заполните пароль'),
});

export const Authorization = () => {
	const [phone, setPhone] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			password: '',
		},
		resolver: yupResolver(authFormScheme),
	});

	const [serverError, setServerError] = useState('');

	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const user = useSelector(selectUser);

	const onSubmit = ({ password }: { password: string }) => {
		const phoneFormat = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '');
		request('/login', 'POST', { phone: phoneFormat, password }).then(({ error, data }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			dispatch(setUser(data));
			navigate('/');
		});
	};

	const formError = errors?.password?.message;
	const errorMessage = formError || serverError;

	if (user.roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return user.roleId === ROLE.GUEST ? (
		<AuthorizationContainer>
			<h1>Вход</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputMask
					placeholder="Номер телефона..."
					width="300px"
					onChange={(target: any) => {
						setPhone(target.target.value);
					}}
				/>
				<Input type="password" placeholder="Пароль..." width="300px" {...register('password', { onChange: () => setServerError('') })} />
				<Button className="login-button" description="Войти" type="submit" disabled={!!formError} />

				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
			</form>
			<Button description="Зарегистрироваться" onClick={() => navigate('/')} />
		</AuthorizationContainer>
	) : (
		<></>
	);
};

export const AuthorizationContainer = styled.div`
	background-color: #e5e5e5;
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 700px;
	height: 600px;
	margin: 100px auto;
	border-radius: 10px;

	& form {
		display: flex;
		flex-direction: column;
	}

	& button {
		width: 200px;
	}

	& button:hover {
		background-color: #f1f1f1;
		color: #090909;
		transition: 0.3s;
	}

	& .login-button {
		margin-top: 40px;
	}
`;
