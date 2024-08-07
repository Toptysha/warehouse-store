import styled from 'styled-components';
import { ROLE, ROLES_FOR_CLIENT } from '../../../constants';
import { useState } from 'react';
import { Button } from '../../../components';
import { request } from '../../../utils';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/selectors';
import { useAppDispatch } from '../../../redux/store';
import { closeModal, openModal } from '../../../redux/reducers';

export const UserRow = ({ id, login, phone, registeredAt, roleId }: { id: string; login: string; phone: string; registeredAt: string; roleId: string }) => {
	const [initialRoleId, setInitialRoleId] = useState(roleId);
	const [selectedRoleId, setSelectedRoleId] = useState(roleId);

	const currentUser = useSelector(selectUser);
	const dispatch = useAppDispatch();

	const onSaveRole = () => {
		request(`/users/${id}`, 'PATCH', { roleId: selectedRoleId }).then(({ error }) => {
			if (error) {
				console.log(error);
				return;
			}
			setInitialRoleId(selectedRoleId);
		});
	};

	const onDeleteUser = () => {
		dispatch(
			openModal({
				text: `Удалить пользователя ${login}?`,
				onConfirm: () => {
					request(`/users/${id}`, 'DELETE').then(({ error }) => {
						if (error) {
							console.log(error);
							return;
						}
					});
					dispatch(closeModal());
				},
				onCancel: () => dispatch(closeModal()),
			}),
		);
	};

	return (
		<UserRowContainer>
			<div className="infoPoint">
				{login}{' '}
				{currentUser.id !== id && (
					<div className="delete-user-button">
						<Button description="🗑️" width="35px" onClick={onDeleteUser} />
					</div>
				)}
			</div>
			<div className="infoPoint">{phone}</div>
			<div className="infoPoint">{registeredAt}</div>
			<div className="infoPoint">
				<select
					value={selectedRoleId}
					onChange={(event) => {
						setSelectedRoleId(event.target.value);
					}}
					disabled={Number(selectedRoleId) === Number(ROLE.ADMIN) && Number(currentUser.id) === Number(id)}
				>
					{Object.entries(ROLES_FOR_CLIENT).map((point) => {
						return (
							point[1] !== ROLE.GUEST && (
								<option key={point[1]} value={point[1]}>
									{point[0]}
								</option>
							)
						);
					})}
				</select>
				{currentUser.id !== id && <Button description="💾" width="35px" onClick={onSaveRole} disabled={Number(initialRoleId) === Number(selectedRoleId)} />}
			</div>
		</UserRowContainer>
	);
};

const UserRowContainer = styled.div`
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
	font-weight: 400;

	& .infoPoint {
		// background-color: red;
		position: relative;
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	& select {
		height: 25px;
		border-radius: 5px;
		padding-left: 5px;
	}

	& .infoPoint button {
		right: -15px;
		position: absolute;
		background: none;
		border: none;
	}

	& .delete-user-button {
		position: absolute;
		top: -5px;
		right: 260px;
	}
`;
