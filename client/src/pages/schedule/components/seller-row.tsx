import styled from 'styled-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Button } from '../../../components';
import { SelectedDate, User } from '../../../interfaces';
import { trimmingText } from '../../../utils';

export const SellerRow = ({
	id,
	login,
	color,
	sellers,
	setSellers,
	currentColorUser,
	setCurrentColorUser,
	selectedDates,
	setSelectedDates,
	isEditing,
}: {
	id: string;
	login: string;
	color: string;
	sellers: User[];
	setSellers: Dispatch<SetStateAction<User[]>>;
	currentColorUser: User;
	setCurrentColorUser: Dispatch<SetStateAction<User>>;
	selectedDates: SelectedDate[];
	setSelectedDates: Dispatch<SelectedDate[]>;
	isEditing: boolean;
}) => {
	const [selectedColor, setSelectedColor] = useState('');
	const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

	const onSaveColor = () => {
		const updatedSellers = sellers.map((seller) => (seller.id === id ? { ...seller, color: selectedColor } : seller));
		setSellers(updatedSellers);
		setIsColorPickerOpen(false);

		const updatedColor = selectedDates.map(({ day, colors, sellerIds }) => {
			const updatedColors = colors.map((color, index) => (Number(sellerIds[index]) === Number(id) ? selectedColor : color));
			return {
				day,
				colors: updatedColors,
				sellerIds,
			};
		});
		setSelectedDates(updatedColor);
	};

	const onDeleteUser = () => {
		setSellers(sellers.filter((seller) => seller.id !== id));
	};

	return (
		<SellerRowContainer $color={id === currentColorUser?.id ? color : '#000'}>
			<div
				className="login"
				onClick={() => {
					isEditing && setCurrentColorUser(sellers.filter((seller) => seller.id === id)[0]);
				}}
			>
				<ColoredCircle $color={color as string} />
				{trimmingText(login, 12)}
			</div>
			{isEditing && (
				<div className="change-buttons">
					<Button
						description={`Изменить цвет`}
						width="140px"
						onClick={() => {
							setIsColorPickerOpen(true);
						}}
					/>
					{isColorPickerOpen && (
						<ColorPickerContainer>
							<SketchPicker color={selectedColor} onChangeComplete={(color) => setSelectedColor(color.hex)} />
							<Button description="Сохранить" width="80px" onClick={onSaveColor} />
							<Button description="Отмена" width="80px" onClick={() => setIsColorPickerOpen(false)} />
						</ColorPickerContainer>
					)}
					<Button description="🗑️" width="35px" onClick={onDeleteUser} />
				</div>
			)}
		</SellerRowContainer>
	);
};

const SellerRowContainer = styled.div<{ $color: string }>`
	// background-color: #bff;
	width: 100%;
	margin: 5px 0 5px 10px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;

	& .login {
		// background-color: #baf;
		cursor: pointer;
		display: flex;
		align-items: center;
		width: 150px;
		color: ${({ $color }) => $color};
	}

	& .change-buttons button {
		background: none;
		border: none;
		color: #d60000;
		text-decoration: underline;
		font-size: 14px;
		font-weight: 400;
		margin: 0 10px;
		&:last-child {
			text-decoration: none;
		}
	}

	& .change-buttons button:hover {
		text-decoration: none;
	}
`;

const ColoredCircle = styled.div<{ $color: string }>`
	width: 15px;
	height: 15px;
	background-color: ${({ $color }) => ($color ? $color : 'transparent')};
	border-radius: 50%;
	margin-right: 10px;
`;

const ColorPickerContainer = styled.div`
	position: absolute;
	z-index: 2;
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: white;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
`;
