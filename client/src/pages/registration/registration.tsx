import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Button, Input, InputMask } from '../../components';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthFormError } from '../../components';
import { useAppDispatch } from '../../redux/store';
import { setUser } from '../../redux/reducers';
import { selectUser } from '../../redux/selectors';
import { ROLE } from '../../constants';
import { request } from '../../utils';

const regFormScheme = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^[а-яА-ЯёЁ0-9a-zA-Z\s]+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа')
		.max(20, 'Неверно заполнен логин. Максимум 20 символов'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(/^[\w#%]+$/, 'Неверно заполнен пароль. Допускаются буквы, цифры и знаки # %')
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
	passCheck: yup
		.string()
		.required('Повторите пароль')
		.oneOf([yup.ref('password'), ''], 'пароли не совпадают'),
});

export const Registration = () => {
	const [phone, setPhone] = useState('');
	const [viewError, setViewError] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			passCheck: '',
		},
		resolver: yupResolver(regFormScheme),
	});

	const navigate = useNavigate();

	const [serverError, setServerError] = useState('');

	const dispatch = useAppDispatch();

	const user = useSelector(selectUser);

	const onSubmit = ({ login, password }: { login: string; password: string }) => {
		if (!phone) {
			setViewError(true);
			setTimeout(() => setViewError(false), 2500);
			return;
		}

		const phoneFormat = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '');
		request('/register', 'POST', { login, phone: phoneFormat, password }).then(({ error, data }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			dispatch(setUser(data));
			navigate('/');
		});
	};

	let allErrors = {
		serverError,
		formError: errors?.password?.message,
		phoneError: !phone && viewError ? 'Введите номер телефона' : '',
	};

	const error = allErrors.serverError || allErrors.phoneError || allErrors.formError;

	if (user.roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<RegistrationContainer>
			<h1>Регистрация</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input type="text" placeholder="Логин..." width="300px" {...register('login', { onChange: () => setServerError('') })} />
				<InputMask
					placeholder="Номер телефона..."
					width="300px"
					onChange={(target: any) => {
						setPhone(target.target.value);
					}}
				/>
				<Input type="password" placeholder="Пароль..." width="300px" {...register('password', { onChange: () => setServerError('') })} />
				<Input type="password" placeholder="Повторите пароль..." width="300px" {...register('passCheck', { onChange: () => setServerError('') })} />
				<Button className="reg-button" description="Зарегистрироваться" type="submit" disabled={!!error} />
				{error ? <AuthFormError>{error}</AuthFormError> : null}
			</form>
			<Button description="Авторизация" onClick={() => navigate('/login')} />
		</RegistrationContainer>
	);
};

const RegistrationContainer = styled.div`
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

	& .reg-button {
		margin-top: 40px;
	}
`;
