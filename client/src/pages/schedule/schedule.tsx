import styled from 'styled-components';
import { Button, Loader, PrivateContent } from '../../components';
import { ACCESS } from '../../constants';
import { useSelector } from 'react-redux';
import { selectApp, selectUser } from '../../redux/selectors';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { closeLoader, closeModal, openModal } from '../../redux/reducers';
import { Calendar, SellerRow } from './components';
import { ReactSelectOptionType, SelectedDate, User } from '../../interfaces';
import { formatDateFromDb, getDaysInMonth, getISODateString, reactSelectStyles, request } from '../../utils';
import Select, { SingleValue } from 'react-select';

export const Schedule = () => {
	const today = new Date();

	const [users, setUsers] = useState<User[]>([]);
	const [sellersInit, setSellersInit] = useState<User[]>([]);
	const [sellers, setSellers] = useState<User[]>([]);
	const [currentColorUser, setCurrentColorUser] = useState<User>();
	const [selectedUser, setSelectedUser] = useState<SingleValue<string>>('');
	const [usersForSellers, setUsersForSellers] = useState<ReactSelectOptionType[]>([{ value: '', label: '' }]);
	const [selectedDatesInit, setSelectedDatesInit] = useState<SelectedDate[]>([]);
	const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([]);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [latestUpdate, setLatestUpdate] = useState<SelectedDate>();

	const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
	const [currentYear, setCurrentYear] = useState(today.getFullYear());
	const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(today.getFullYear(), today.getMonth()));

	const dispatch = useAppDispatch();
	const loader = useSelector(selectApp).loader;
	const currentUser = useSelector(selectUser);

	useEffect(() => {
		request(`/schedule/find_by_month`, 'POST', { year: currentYear, month: currentMonth }).then(({ error, data }) => {
			if (error) {
				console.log(error);
				dispatch(closeLoader());
			} else {
				setSelectedDatesInit(data.schedules);
				setSelectedDates(data.schedules);

				setLatestUpdate(data.latestUpdated);

				let usersId: string[] = [];
				data.schedules.forEach((scheduleElement: SelectedDate) => {
					scheduleElement.sellerIds.forEach((sellerId) => {
						!usersId.includes(sellerId) && usersId.push(sellerId);
					});
				});

				const userPromises = usersId.map((sellerId) => request(`/users/${sellerId}`));

				// Обрабатываем результаты всех промисов
				Promise.all(userPromises)
					.then((userResults) => {
						// userResults - массив результатов промисов
						let errorUsers = null;
						let dataUsers: User[] = [];

						userResults.forEach(({ error, data }) => {
							if (error) {
								errorUsers = error;
							} else {
								dataUsers.push(data);
							}
						});

						if (errorUsers) {
							console.log(errorUsers);
						} else {
							setSellersInit(dataUsers);
							setSellers(dataUsers);
						}
					})
					.catch((error) => {
						console.log('Error fetching users:', error);
					})
					.finally(() => {
						dispatch(closeLoader());
					});
			}
		});
		request(`/users/get_color`).then(({ error, data }) => {
			if (error) {
				console.log(error);
			} else {
				setUsers(data);
				setUsersForSellers(Object.values(data).map((user: any) => ({ value: user.login, label: user.login })));
			}
		});
	}, [currentUser.roleId, dispatch, currentMonth, currentYear]);

	const onChangeSellers = () => {
		const currentSellers = [...sellers];
		currentSellers.push(users.filter(({ login }) => login === selectedUser && !sellers.some((seller) => seller.login === selectedUser))[0]);
		setSellers(currentSellers.filter((user) => !!user));
	};

	const onConfirmSchedule = async () => {
		try {
			// Формируем данные для отправки расписания
			const data = selectedDates.map((obj) => ({
				date: getISODateString(obj.day, currentMonth, currentYear),
				sellers: obj.sellerIds.map((id) => Number(id)),
				authorId: Number(currentUser.id),
				updatedAt: new Date().toISOString(),
			}));

			// Отправляем данные расписания
			const scheduleResponse = await request(`/schedule`, 'POST', { data });

			if (scheduleResponse.error) {
				console.log(scheduleResponse.error);
				return;
			} else {
				setUsers(scheduleResponse.data);
				setUsersForSellers(
					Object.values(scheduleResponse.data).map((user: any) => ({
						value: user.login,
						label: user.login,
					})),
				);
			}

			// Обновляем цвета пользователей
			await Promise.all(sellers.map((user) => request(`/users/change_color`, 'POST', { id: user.id, color: user.color })));

			setIsEditing(false);
		} catch (error) {
			console.error('Error in onConfirmSchedule:', error);
		}
	};

	const onCancelSchedule = () => {
		setSellers(sellersInit);
		setSelectedDates(selectedDatesInit);
		setCurrentColorUser(undefined);
		setIsEditing(false);
	};

	return loader ? (
		<Loader />
	) : (
		<PrivateContent access={ACCESS.EDIT_SCHEDULES}>
			<ScheduleContainer>
				<div className="sellers">
					{sellers.map((user) => (
						<SellerRow
							key={user.id}
							id={user.id}
							login={user.login}
							color={user.color as string}
							sellers={sellers}
							setSellers={setSellers}
							currentColorUser={currentColorUser as User}
							setCurrentColorUser={setCurrentColorUser as Dispatch<SetStateAction<User>>}
							selectedDates={selectedDates}
							setSelectedDates={setSelectedDates}
							isEditing={isEditing}
						/>
					))}
					{isEditing && (
						<div className="bottom-menu">
							<div className="add-sellers">
								<Select
									className="select-sellers"
									value={selectedUser ? { value: selectedUser, label: selectedUser } : null}
									onChange={(option: SingleValue<ReactSelectOptionType>) => setSelectedUser(option ? option.value : '')}
									options={usersForSellers}
									isClearable
									isSearchable
									noOptionsMessage={() => 'Нет совпадений'}
									placeholder="Выбрать..."
									styles={reactSelectStyles('200px')}
								/>
								<div className="buttons">
									<Button
										description={`Добавить`}
										width="100px"
										onClick={() => {
											onChangeSellers();
										}}
									/>
								</div>
							</div>
							<div className="buttons">
								<Button
									description={`Очистить дату`}
									width="130px"
									onClick={() => {
										setCurrentColorUser(undefined);
									}}
								/>
							</div>
						</div>
					)}
					{isEditing ? (
						<div className="save-buttons">
							<Button
								description={`Сохранить`}
								width="180px"
								onClick={() => {
									dispatch(
										openModal({
											text: 'Сохранить расписание?',
											onConfirm: () => {
												onConfirmSchedule();
												dispatch(closeModal());
											},
											onCancel: () => dispatch(closeModal()),
										}),
									);
								}}
							/>
							<Button
								description={`Отменить`}
								width="180px"
								onClick={() => {
									dispatch(
										openModal({
											text: 'Отменить изменения?',
											onConfirm: () => {
												onCancelSchedule();
												dispatch(closeModal());
											},
											onCancel: () => dispatch(closeModal()),
										}),
									);
								}}
							/>
						</div>
					) : (
						<div className="save-buttons">
							<Button
								description={`Редактировать`}
								width="180px"
								onClick={() => {
									setIsEditing(true);
								}}
							/>
						</div>
					)}
				</div>
				<Calendar
					currentColorUser={currentColorUser}
					setCurrentColorUser={setCurrentColorUser}
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					currentMonth={currentMonth}
					setCurrentMonth={setCurrentMonth}
					currentYear={currentYear}
					setCurrentYear={setCurrentYear}
					daysInMonth={daysInMonth}
					setDaysInMonth={setDaysInMonth}
					isEditing={isEditing}
				/>
				<div className="last-update">{`${latestUpdate?.authorName} последний раз обновляла расписание ${formatDateFromDb(latestUpdate?.updatedAt as string)}`}</div>
			</ScheduleContainer>
		</PrivateContent>
	);
};

const ScheduleContainer = styled.div`
	width: 1100px;
	margin: 0 auto;

	& .buttons button {
		background: none;
		border: none;
		color: #d60000;
		text-decoration: underline;
		font-size: 16px;
		margin: 10px;
	}

	& .buttons button:hover {
		text-decoration: none;
	}

	& .sellers {
		border-top: 1px solid #ddd;
		border-left: 1px solid #ddd;
		border-right: 1px solid #ddd;
		width: 800px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	& .bottom-menu {
		// background: #aaaaaa;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 10px;
	}

	& .add-sellers {
		// background: #aaaaaa;
		display: flex;
		align-items: center;
	}

	& .select-products {
		width: 300px;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #000000;
		margin: 10px 0;
		font-size: 18px;
		font-weight: 500;
	}

	& .save-buttons {
		width: 80%;
		margin: 20px auto 0;
		display: flex;
		justify-content: space-between;
	}

	& .last-update {
		// background: #aaaaaa;
		text-align: right;
		padding: 10px 150px 0 0;
		font-size: 18px;
		font-weight: 500;
	}
`;
