import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { selectUser } from '../../redux/selectors';
import { ROLE } from '../../constants';

export const Location = () => {
	const user = useSelector(selectUser);

	const { pathname } = useLocation();

	const route = () => {
		const arrOfPath = pathname.split('/');
		let paths = ['http://localhost:3000'];
		let names = ['Home'];

		arrOfPath.forEach((element, index) => {
			if (element !== '') {
				paths.push(paths[index - 1] + '/' + element);
				if (index === 2 && names[index - 1] === ' / catalog') {
					names.push(' / product');
				} else {
					names.push(' / ' + element);
				}
			}
		});

		return { paths, names };
	};

	const { paths, names } = route();

	return user.roleId !== ROLE.GUEST ? (
		<LocationContainer>
			{paths.map((path, index) => {
				return (
					<Link key={index} to={path}>
						<span>{names[index]}</span>
					</Link>
				);
			})}
		</LocationContainer>
	) : (
		<></>
	);
};

const LocationContainer = styled.div`
	// background-color: white;
	// text-align: center;
	margin: 100px auto 20px;
	padding-left: 10px;
	width: 1100px;

	& a {
		color: black;
		text-decoration: none;
	}
`;
