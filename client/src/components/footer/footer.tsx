import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ROLE } from '../../constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';

export const Footer = () => {
	const [weather, setWeather] = useState({ city: '', temperature: '', description: '' });

	const date = new Date().toLocaleString('ru', { day: 'numeric', month: 'long' });

	const user = useSelector(selectUser);

	useEffect(() => {
		fetch('https://api.openweathermap.org/data/2.5/weather?q=Voronezh&units=metric&lang=ru&appid=f31dccbbf76db01aa53fa288ccd48471')
			.then((res) => res.json())
			.then(({ name, main, weather }) => setWeather({ city: name, temperature: Math.round(main.temp).toString(), description: weather[0].description }));
	}, []);

	return user.roleId !== ROLE.GUEST ? (
		<FooterContainer>
			<div className="info-container">
				<div>
					Магазин одежды <br /> Beauty
				</div>
				<div>
					{date}
					<br />
					{`В Воронеже сейчас ${weather.description}, t ${weather.temperature}°`}
				</div>
			</div>
		</FooterContainer>
	) : (
		<></>
	);
};

export const FooterContainer = styled.div`
	display: flex;
	justify-content: center;
	background: #e5e5e5;
	font-weight: bold;
	width: 100%;
	height: 60px;
	padding: 10px;
	margin-top: 25px;

	& .info-container {
		// background: red;
		width: 1100px;
		display: flex;
		justify-content: space-between;
	}
`;
