import { Button } from '../button/button';
import { Input } from '../input/input';
import styled from 'styled-components';

export const Search = ({
	searchPhrase,
	onChange,
	onClick,
	width,
}: {
	searchPhrase: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: () => void;
	width?: string;
}) => {
	return (
		<SearchContainer width={width}>
			<Input placeholder="Что найти?" width="400px" onChange={onChange} value={searchPhrase} />
			<Button description="Поиск" onClick={onClick} />
		</SearchContainer>
	);
};

const SearchContainer = styled.div<{ width?: string }>`
	background: #fff4fc;
	display: flex;
	width: ${({ width = '100%' }) => width};
	height: 40px;
	margin: 40px auto 0;
	border: 1px solid #000;
	border-radius: 5px;

	& input {
		background: #fff4fc;
		margin: 0 15px 0 0;
		border: none;
		outline: none;
		height: 100%;
	}

	& button {
		background: #fff4fc;
		margin: 0 0 0 15px;
		border: none;
		height: 100%;
	}
`;
