import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { useDeletePhoto } from '../../hooks';
import { PhotoWithDeleteLine } from '../photo-with-delete-line/photo-with-delete-line';

export const FillAllPhotos = ({
	limit,
	photoUrls,
	isPageRefresh,
	setIsPageRefresh,
}: {
	limit: number;
	photoUrls: string[];
	isPageRefresh: boolean;
	setIsPageRefresh: Dispatch<SetStateAction<boolean>>;
}) => {
	const deletePhoto = useDeletePhoto();

	const onDeletePhoto = async (photoUrl: string) => {
		deletePhoto(photoUrl, isPageRefresh, setIsPageRefresh);
	};

	let stackProducts = [];
	for (let i = 0; i < limit; i++) {
		if (i < photoUrls?.length) {
			stackProducts.push(
				<div key={i}>
					<PhotoWithDeleteLine onClick={() => onDeletePhoto(photoUrls[i])} photoUrl={photoUrls[i]} />
				</div>,
			);
		} else {
			stackProducts.push(<div key={i} className="fake-photo"></div>);
		}
	}
	return <PhotosContainer>{stackProducts}</PhotosContainer>;
};

const PhotosContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 100%;

	& .fake-photo {
		// background-color: grey;
		width: 250px;
		height: 250px;
		margin: 10px 0 0 10px;
	}
`;
