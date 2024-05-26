import styled from 'styled-components';
import { Loader, PrivateContent } from '../../components';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';
import { useAppDispatch } from '../../redux/store';
import { useEffect, useState } from 'react';
import { formatDateFromDb, request } from '../../utils';
import { closeLoader } from '../../redux/reducers';
import { User } from '../../interfaces';
import { UserRow } from './components';
import { ROLE } from '../../constants';

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
				// console.log(data);
				setUsers(data.map((user: any) => ({ ...user, registeredAt: formatDateFromDb(user.registeredAt) })));
				dispatch(closeLoader());
			}
		});
	}, [dispatch]);

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={[ROLE.ADMIN.toString()]}>
			<UsersContainer>
				<div className="users">
					<div className="table-header">
						<div className="table-title">Логин:</div>
						<div className="table-title">Телефон:</div>
						<div className="table-title">Дата регистрации:</div>
						<div className="table-title">Должность:</div>
					</div>
					{users.map((user) => (
						<UserRow key={user.login} id={user.id} login={user.login} phone={user.phone} registeredAt={user.registeredAt} roleId={user.roleId} />
					))}
				</div>
			</UsersContainer>
		</PrivateContent>
	);
};

const UsersContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 40px auto;
	min-height: 80vh;

	& .users {
		// background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		// justify-content: center;
		width: 100%;
		max-height: 70vh;
		overflow-y: auto;
	}

	& .table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 50px;
		background-color: #f2f2f2;
		border-radius: 10px;
		margin-bottom: 10px;
		padding: 0 20px;
		box-sizing: border-box;
		font-size: 18px;
		font-weight: 600;
	}

	& .table-title {
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		// border: 1px solid black;
	}
`;
