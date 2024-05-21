import styled from 'styled-components';

export const NameMenuPoint = ({ onClick, description }: { onClick: () => void; description: string }): JSX.Element => {
	return (
		<NameMenuPointContainer className="NameMenuPointContainer2" onClick={onClick}>
			{description}
		</NameMenuPointContainer>
	);
};

const NameMenuPointContainer = styled.div`
	padding: 10px;
	cursor: pointer;
`;
