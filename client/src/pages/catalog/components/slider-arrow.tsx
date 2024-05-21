import arrow from '../../../images/arrow-e5e5e5.png';
import styled from 'styled-components';

interface Props {
	$arrowDirection: 'left' | 'right';
}

export const SliderArrow = ({ $arrowDirection, onClick }: { $arrowDirection: Props['$arrowDirection']; onClick?: () => void }) => {
	return (
		<SliderArrowContainer $arrowDirection={$arrowDirection} onClick={onClick}>
			<img src={arrow} alt="arrow" />
		</SliderArrowContainer>
	);
};

const SliderArrowContainer = styled.div<Props>`
	cursor: pointer;
	// background-color: rgba(255, 255, 255, 0.1);
	top: 0;
	${(p) => (p.$arrowDirection === 'left' ? 'left: 0;' : 'right: 0;')};
	height: 290px;
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0 5px;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	transform: ${(p) => (p.$arrowDirection === 'left' ? 'rotate(180deg)' : 'rotate(0deg)')};

	& img {
		height: 40px;
		opacity: 0.6;
	}

	// &:hover {
	// 	background-color: rgba(255, 255, 255, 0.4);
	// 	transition: 0.5s ease;
	// }

	&:hover img {
		opacity: 1;
		transition: 0.5s ease;
	}
`;
