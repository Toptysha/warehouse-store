import styled from 'styled-components';
import { DeleteLine } from '../delete-line/delete-line';

export const PhotoWithDeleteLine = ({ onClick, photoUrl }: { onClick: () => void; photoUrl: string }) => {
	return (
		<PhotoWithDeleteLineContainer>
			<DeleteLine onClick={onClick} />
			<img src={photoUrl} alt="COVER" />
		</PhotoWithDeleteLineContainer>
	);
};

const PhotoWithDeleteLineContainer = styled.div`
	width: 250px;
	height: 250px;
	margin: 10px 0 0 10px;
	position: relative;
	overflow: hidden;

	& img {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		object-fit: cover;
	}
`;
