import { Dispatch, SetStateAction } from 'react';
import { Button } from '../button/button';
import styled from 'styled-components';

export const Pagination = ({ page, setPage, lastPage }: { page: number; setPage: Dispatch<SetStateAction<number>>; lastPage: number }) => {
	return (
		<PaginationContainer>
			<Button description="В начало" disabled={page === 1} onClick={() => setPage(1)} />
			<Button description="Предыдущая" disabled={page === 1} onClick={() => setPage(page - 1)} />

			<div className="currentPage">Страница: {page}</div>
			<Button description="Следующая" disabled={page === lastPage} onClick={() => setPage(page + 1)} />
			<Button description="В конец" disabled={page === lastPage} onClick={() => setPage(lastPage)} />
		</PaginationContainer>
	);
};

const PaginationContainer = styled.div`
	display: flex;
	justify-content: center;
	margin: 0px 0 20px;
	padding: 0 25px;

	width: 100%;

	& button {
		margin: 0 20px;
		width: 180px;
	}

	& .currentPage {
		padding-top: 6px;
		border: 1px solid #000;
		border-radius: 5px;
		width: 180px;
		height: 40px;
		margin: 0 20px;
		text-align: center;
		font-size: 17px;
		font-weight: 500;
	}
`;
