import styled from 'styled-components';
import { Switcher } from '../switcher/switcher';
import { Dispatch, SetStateAction } from 'react';
import { Search } from '../search/search';

interface SwitcherArgs {
	position: number;
	setPosition: Dispatch<SetStateAction<number>>;
	positionNames: string[];
}

interface SearchArgs {
	searchPhrase: string;
	setSearchPhrase: Dispatch<SetStateAction<string>>;
	shouldSearch: boolean;
	setShouldSearch: Dispatch<SetStateAction<boolean>>;
}

export const Table = ({
	headers,
	$headerFontSize,
	tablePoints,
	isSwitcher,
	isSearch,
	switcherArgs,
	searchArgs,
}: {
	headers: string[];
	$headerFontSize: string;
	tablePoints: React.ReactNode[][];
	isSwitcher: boolean;
	isSearch: boolean;
	switcherArgs?: SwitcherArgs;
	searchArgs?: SearchArgs;
}) => {
	return (
		<TableContainer $headerFontSize={$headerFontSize}>
			{isSwitcher && (
				<div className="switcher">
					<Switcher
						position={switcherArgs?.position as number}
						setPosition={switcherArgs?.setPosition as Dispatch<SetStateAction<number>>}
						positionNames={switcherArgs?.positionNames as string[]}
					/>
				</div>
			)}
			{isSearch && (
				<Search
					searchPhrase={searchArgs?.searchPhrase as string}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => searchArgs?.setSearchPhrase(event.target.value)}
					onClick={() => searchArgs?.setShouldSearch(!searchArgs?.shouldSearch)}
					width="500px"
				/>
			)}
			<div className="sales">
				<div className="table-headers">
					{headers.map((header) => (
						<div key={header} className="table-header">
							{' '}
							{header}{' '}
						</div>
					))}
				</div>
				<div className="table-sales">{switcherArgs?.position === 0 || !isSwitcher ? tablePoints[0] : switcherArgs?.position === 1 ? tablePoints[1] : tablePoints[2]}</div>
			</div>
		</TableContainer>
	);
};

const TableContainer = styled.div<{ $headerFontSize?: string }>`
	// display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 1100px;
	margin: 20px auto 40px;

	& .switcher {
		// background-color: #fff;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	& .sales {
		width: 100%;
		margin: 20px auto 0;
	}

	& .table-headers {
		// background-color: green;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 50px;
		background-color: #f2f2f2;
		border-radius: 10px;
		margin: 0 0 10px 0;
		padding: 0px 20px;
		box-sizing: border-box;
		font-size: ${({ $headerFontSize = '18px' }) => $headerFontSize};
		font-weight: 600;
	}

	& .table-header {
		// background-color: yellow;
		// border: 1px solid grey;
		width: 100%;
		text-align: center;
	}

	& .table-sales {
		width: 100%;
		max-height: 70vh;
		overflow-y: auto;
	}

	& .table-sales::-webkit-scrollbar {
		display: none;
	}

	& .table-title {
		width: 25%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
