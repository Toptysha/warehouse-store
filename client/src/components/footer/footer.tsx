import styled from 'styled-components';
import { ROLE } from '../../constants';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors';

export const Footer = () => {
	const date = new Date().toLocaleString('ru', { day: 'numeric', month: 'long' });

	const user = useSelector(selectUser);

	return user.roleId !== ROLE.GUEST ? (
		<FooterContainer>
			<div className="info-container">
				<div>
					Магазин одежды <br /> Beauty
				</div>
				<div>
					{date}
					<br />
					{`В Воронеже сейчас хорошо`}
				</div>
			</div>
		</FooterContainer>
	) : (
		<></>
	);
};

const FooterContainer = styled.footer`
	width: 100%;
	min-width: 1100px;
	height: 60px;
	background-color: #e5e5e5;
	font-weight: 500;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	margin-top: 25px;
	padding: 20px;
	bottom: 0;

	@media (min-width: 1100px) {
		height: 80px;
	}

	& .info-container {
		width: 100%;
		min-width: 300px;
		max-width: 1100px;
		display: flex;
		justify-content: space-between;
		padding: 0 20px;
	}
`;
