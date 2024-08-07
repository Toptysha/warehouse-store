import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { MONTHS } from '../../../constants';
import { SelectedDate, User } from '../../../interfaces';
import arrow from '../../../images/arrow.png';
import { getDaysInMonth } from '../../../utils';

interface CalendarProps {
	currentColorUser: User | undefined;
	setCurrentColorUser: Dispatch<SetStateAction<User | undefined>>;
	selectedDates: SelectedDate[];
	setSelectedDates: Dispatch<SetStateAction<SelectedDate[]>>;
	currentMonth: number;
	setCurrentMonth: Dispatch<SetStateAction<number>>;
	currentYear: number;
	setCurrentYear: Dispatch<SetStateAction<number>>;
	daysInMonth: number[];
	setDaysInMonth: Dispatch<SetStateAction<number[]>>;
	isEditing: boolean;
}

export const Calendar = ({
	currentColorUser,
	setCurrentColorUser,
	selectedDates,
	setSelectedDates,
	currentMonth,
	setCurrentMonth,
	currentYear,
	setCurrentYear,
	daysInMonth,
	setDaysInMonth,
	isEditing,
}: CalendarProps) => {
	const handleDateClick = (day: number) => {
		if (currentColorUser) {
			setSelectedDates((prevState) => {
				const existingDate = prevState.find((date) => date.day === day);
				if (existingDate) {
					const updatedColors = [...existingDate.colors];
					const updatedSellerIds = [...existingDate.sellerIds];
					if (updatedColors.length === 3) {
						updatedColors.shift();
						updatedSellerIds.shift();
					}
					updatedColors.push(currentColorUser.color as string);
					updatedSellerIds.push(currentColorUser.id);
					return prevState.map((date) =>
						date.day === day
							? date.colors[0]
								? { ...date, colors: updatedColors, sellerIds: updatedSellerIds }
								: { day, colors: [currentColorUser.color as string], sellerIds: [currentColorUser.id] }
							: date,
					);
				}
				return [
					...prevState,
					{
						day,
						colors: [currentColorUser.color as string],
						sellerIds: [currentColorUser.id],
					},
				];
			});
		} else {
			const setNullDay = selectedDates.map((date) => (date.day === day ? { day, colors: [''], sellerIds: [''] } : date));
			setSelectedDates(setNullDay);
		}
	};

	const getColorStyle = (day: number): string => {
		const selectedDate = selectedDates.find((date) => date.day === day);
		if (selectedDate) {
			const { colors } = selectedDate;
			if (colors.length === 1) return colors[0];
			if (colors.length === 2) return `linear-gradient(180deg, ${colors[0]} 50%, ${colors[1]} 50%)`;
			if (colors.length === 3) {
				return `linear-gradient(0deg, ${colors[2]} 0%, ${colors[2]} 33.33%, ${colors[1]} 33.33%, ${colors[1]} 66.66%, ${colors[0]} 66.66%, ${colors[0]} 100%)`;
			}
		}
		return 'transparent';
	};

	const onChangeMonth = (where: 'minus' | 'plus') => {
		setCurrentColorUser(undefined);
		if (where === 'minus') {
			const newCurrentMonth = currentMonth !== 1 ? currentMonth - 1 : 12;
			const newCurrentYear = currentMonth !== 1 ? currentYear : currentYear - 1;

			setCurrentMonth(newCurrentMonth);
			setCurrentYear(newCurrentYear);
			setDaysInMonth(getDaysInMonth(newCurrentYear, newCurrentMonth - 1));
		} else {
			const newCurrentMonth = currentMonth !== 12 ? currentMonth + 1 : 1;
			const newCurrentYear = currentMonth !== 12 ? currentYear : currentYear + 1;

			setCurrentMonth(newCurrentMonth);
			setCurrentYear(newCurrentYear);
			setDaysInMonth(getDaysInMonth(newCurrentYear, newCurrentMonth - 1));
		}
	};

	return (
		<CalendarContainer>
			<div
				className="arrow-left"
				onClick={() => {
					onChangeMonth('minus');
				}}
			>
				<img className="arrows-down" src={arrow} alt="arrow" />
			</div>
			<div className="main-block">
				<div className="date">{`${MONTHS[currentMonth - 1]} ${currentYear}`}</div>
				<div className="calendar">
					{daysInMonth.map((day) => (
						<DayCell
							key={day}
							$color={getColorStyle(day)}
							onClick={() => {
								isEditing && handleDateClick(day);
							}}
						>
							{day}
						</DayCell>
					))}
				</div>
			</div>
			<div
				className="arrow-right"
				onClick={() => {
					onChangeMonth('plus');
				}}
			>
				<img className="arrows-down" src={arrow} alt="arrow" />
			</div>
		</CalendarContainer>
	);
};

const CalendarContainer = styled.div`
	border: 1px solid #ddd;
	width: 800px;
	margin: 0 auto;
	display: flex;

	& .date {
		padding: 20px;
		font-size: 24px;
		font-weight: 500;
		text-align: center;
		border-bottom: 1px solid #ddd;
	}

	& .calendar {
		display: grid;
		grid-template-columns: repeat(7, 60px);
		gap: 10px; /* Расстояние между ячейками */
		padding: 20px;
		justify-content: center; /* Центрирование сетки */
	}

	& .main-block {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		// background: #fff;
		// border-radius: 4px;
		// box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	& .arrow-left,
	.arrow-right {
		cursor: pointer;
		width: 60px;
		height: 460px;
		display: flex;
		align-items: center;
		justify-content: center;
		// background: #ddd;
		// border: 1px solid #ccc;
		// border-radius: 4px;
		// transition: background 0.3s;
	}

	& .arrow-left img,
	.arrow-right img {
		width: 40px;
		height: 70px;
		opacity: 0.4;
	}

	& .arrow-left img:hover,
	.arrow-right img:hover {
		opacity: 0.7;
		transition: opacity 0.4s;
	}

	& .arrow-left img {
		rotate: 180deg;
	}
`;

const DayCell = styled.div<{ $color: string }>`
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: ${({ $color }) => $color};
	border: 1px solid #ccc;
	border-radius: 4px;
	transition: background 0.3s;
`;
