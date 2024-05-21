import styled from 'styled-components';

export const Error = ({ error }: { error: string | null }) =>
	error ? (
		<ErrorContainer>
			<h2>Ошибка</h2>
			<div>{error}</div>
		</ErrorContainer>
	) : (
		<></>
	);

export const ErrorContainer = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
`;
