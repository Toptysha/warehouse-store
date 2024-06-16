import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

export const Switcher = ({ position, setPosition, positionNames }: { position: number; setPosition: Dispatch<SetStateAction<number>>; positionNames: string[] }) => {
	const countSwitch: 2 | 3 = positionNames.length as 2 | 3;

	const handleToggle = () => {
		setPosition((prev) => (prev + 1) % countSwitch);
	};

	return (
		<ToggleContainer onClick={handleToggle} $position={position} $countSwitch={countSwitch}>
			<div className="toggle-label">{positionNames[position]}</div>
			<div className="toggle-wrapper">
				<div className="toggle-circle" />
			</div>
		</ToggleContainer>
	);
};

const ToggleContainer = styled.div<{ $position: number; $countSwitch: 2 | 3 }>`
	display: flex;
	align-items: center;
	cursor: pointer;
	width: 300px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	text-align: center;
	margin: 0 0 20px;

	& .toggle-label {
		margin: 0 10px 10px;
		font-size: 18px;
		font-weight: 500;
		width: 100%;
	}

	& .toggle-wrapper {
		position: relative;
		width: 150px;
		height: 30px;
		background: #ccc;
		border-radius: 30px;
		transition: background 0.3s;
	}

	& .toggle-circle {
		position: absolute;
		top: 5px;
		left: ${({ $position, $countSwitch }) =>
			$countSwitch === 2 ? ($position === 0 ? '5px' : 'calc(100% - 25px)') : $position === 0 ? '5px' : $position === 1 ? 'calc(50% - 10px)' : 'calc(100% - 25px)'};
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: left 0.3s;
	}
`;
