import styled from 'styled-components';
import { Button } from '../button/button';
import { useNavigate } from 'react-router-dom';
import { ERROR } from '../../constants';

export const Error = ({ error }: { error: string }) => {
	const navigate = useNavigate();
	return (
		<ErrorContainer>
			<h2>Ошибка:</h2>
			<div className="error">{ERROR.SERVER_AUTH_ERROR === error ? 'Ошибка авторизации' : error}</div>
			{error === ERROR.SERVER_AUTH_ERROR && <Button description="Авторизоваться" onClick={() => navigate('/login')} />}
			{error === ERROR.PAGE_NOT_EXIST && <Button description="На главную" onClick={() => navigate('/')} />}
		</ErrorContainer>
	);
};

export const ErrorContainer = styled.div`
	background-color: rgba(255, 0, 0, 0.7);
	display: flex;
	align-items: center;
	flex-direction: column;
	color: white;
	width: 600px;
	padding: 1rem;
	margin: 100px auto 600px;
	border-radius: 10px;

	& .error {
		color: white;
		font-size: 1.5rem;
	}

	& button {
		margin-top: 1rem;
	}

	& button:hover {
		background-color: #dbdbdb;
		transition: 0.3s;
	}
`;
