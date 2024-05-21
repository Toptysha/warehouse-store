import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const BlockContent = ({ srcCover, description }: { srcCover: string; description: string }) => {
	const navigate = useNavigate();
	return (
		<BlockContentContainer onClick={() => navigate('/catalog')}>
			<img className="cover" src={srcCover} alt="cover" />
			<div className="block-name">{description}</div>
		</BlockContentContainer>
	);
};

const BlockContentContainer = styled.div`
	position: relative;
	cursor: pointer;
	width: 450px;
	height: 450px;
	margin: 25px;

	& .cover {
		width: 450px;
		border-radius: 10px;
	}

	& .block-name {
		background-color: rgba(255, 255, 255, 0.7);
		position: absolute;
		bottom: 0;
		width: 450px;
		text-align: center;
		height: 50px;
		font-size: 32px;
		font-weight: 600;
	}
`;
