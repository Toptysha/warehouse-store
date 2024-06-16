import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { PhotoType } from '../../interfaces';
import { Button } from '../button/button';

export const UploadPhotos = ({
	selectedFiles,
	setSelectedFiles,
	typeOfSelectedFiles,
	description,
	saveButtonDescription,
	handleSavePhotos,
	width,
	$labelLeft,
	$marginContainer,
	$marginLabel,
}: {
	selectedFiles: File[];
	setSelectedFiles: Dispatch<SetStateAction<File[]>>;
	typeOfSelectedFiles: PhotoType;
	description: string;
	saveButtonDescription?: string;
	handleSavePhotos?: (typePhotos: PhotoType) => Promise<void>;
	width?: string;
	$labelLeft?: string;
	$marginContainer?: string;
	$marginLabel?: string;
}) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const filesArray: File[] = Array.from(event.target.files);

			setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...filesArray]);
		}
	};

	const SendButton = () => {
		if (saveButtonDescription && selectedFiles.length > 0) {
			return <Button description={saveButtonDescription} onClick={() => handleSavePhotos && handleSavePhotos(typeOfSelectedFiles)} />;
		}
		return null;
	};

	return (
		<SendPhotosContainer
			$background={`${selectedFiles.length > 0 ? '#e2e2e2' : 'none'}`}
			width={width}
			$labelLeft={$labelLeft}
			$marginContainer={$marginContainer}
			$marginLabel={$marginLabel}
		>
			<div className="upload-photos-container">
				{typeOfSelectedFiles === 'cover' ? (
					<>
						<label htmlFor="cover-file-upload" className="custom-file-upload">
							{description}
						</label>
						<input id="cover-file-upload" type="file" multiple onChange={handleFileChange} />{' '}
					</>
				) : (
					<>
						<label htmlFor="measurements-file-upload" className="custom-file-upload">
							{description}
						</label>
						<input id="measurements-file-upload" type="file" multiple onChange={handleFileChange} />
					</>
				)}
				{selectedFiles && (
					<div className="upload-file-names">
						{selectedFiles.map((file, index) => (
							<div key={index} className="file-names">
								{' '}
								{file.name}{' '}
							</div>
						))}
					</div>
				)}
			</div>
			<SendButton />
		</SendPhotosContainer>
	);
};

export const SendPhotosContainer = styled.div<{ $background: string; width?: string; $labelLeft?: string; $marginContainer?: string; $marginLabel?: string }>`
	background: ${({ $background }) => $background};
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;

	& > button {
		width: 340px;
		margin-top: -20px;
		background: #ffffff;
	}

	& > button:hover {
		background: #e2e2e2;
		transition: 0.3s;
	}

	& .upload-photos-container {
		// background: red;
		position: relative;
		margin: ${({ $marginContainer = '10px 0' }) => $marginContainer};
		width: 100%;
		text-align: center;
	}

	& .custom-file-upload {
		position: absolute;
		top: -130px;
		left: ${({ $labelLeft = '65px' }) => $labelLeft};
		cursor: pointer;
		width: ${({ width = '170px' }) => width};
		background: white;
		border-radius: 5px;
		border: 1px solid black;
		padding: 10px;
		margin: ${({ $marginLabel = '100px' }) => $marginLabel};
	}

	& .custom-file-upload:hover {
		background: #e2e2e2;
		transition: 0.3s;
	}

	& .upload-file-names {
		// background: green;
		display: flex;
		flex-wrap: wrap;
		margin-top: 20px;
		padding: 5px;
		font-size: 14px;
		max-height: 150px;
		overflow-y: auto;
	}

	& .file-names {
		padding: 10px;
		margin-bottom: 5px;
		text-decoration: underline;
	}

	& #measurements-file-upload,
	#cover-file-upload {
		display: none;
	}

	& .reg-button {
		margin: 20px;
		width: 162px;
	}
`;
