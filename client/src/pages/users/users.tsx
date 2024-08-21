import styled from 'styled-components';
import { Loader, PrivateContent, Table } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { useEffect, useState } from 'react';
import { formatDateFromDb, request } from '../../utils';
import { closeLoader } from '../../redux/reducers';
import { User } from '../../interfaces';
import { UserRow } from './components';
import { ACCESS } from '../../constants';

export const Users = () => {
	const [users, setUsers] = useState<User[]>([]);
	const dispatch = useAppDispatch();
	const loader = useSelector(selectApp).loader;

	useEffect(() => {
		request(`/users`).then(({ error, data }) => {
			if (error) {
				console.log(error);
				dispatch(closeLoader());
			} else {
				setUsers(data.map((user: any) => ({ ...user, registeredAt: formatDateFromDb(user.registeredAt) })));
				dispatch(closeLoader());
			}
		});
	}, [dispatch]);

	const tableHeaders = ['Логин', 'Телефон', 'Дата регистрации', 'Должность'];

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.USERS}>
			<UsersContainer>
				<Table
					headers={tableHeaders}
					$headerFontSize="18px"
					tablePoints={[
						users.map((user) => (
							<UserRow
								key={user.login}
								id={user.id}
								login={user.login}
								reservePass={user.reservePass as string}
								phone={user.phone}
								registeredAt={user.registeredAt}
								roleId={user.roleId}
							/>
						)),
					]}
					isSwitcher={false}
					isSearch={false}
				/>
			</UsersContainer>
		</PrivateContent>
	);
};

const UsersContainer = styled.div`
	min-height: 80vh;
`;
