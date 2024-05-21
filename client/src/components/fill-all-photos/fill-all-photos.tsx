import styled from 'styled-components';
import { Button } from '../button/button';
import { Dispatch, SetStateAction } from 'react';
import { useDeletePhoto } from '../../hooks';

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
				<div key={i} className="cover">
					<div className="delete-line">
						<Button description="×" onClick={() => onDeletePhoto(photoUrls[i])} />
					</div>
					<img src={photoUrls[i]} alt="Cover" />
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

	& .cover {
		width: 250px;
		height: 250px;
		margin: 10px 0 0 10px;
		position: relative;
		overflow: hidden;
	}

	& .cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	& .delete-line {
		background: rgba(0, 0, 0, 0.3);
		position: absolute;
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
	}

	& .delete-line button {
		background: #d60000;
		color: white;
		font-size: 30px;
		margin-left: 210px;
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 12px;
	}

	& .delete-line button:hover {
		background: #c00000;
		color: #f0f0f0;
		transition: 0.3s;
	}

	& .fake-photo {
		// background-color: grey;
		width: 250px;
		height: 250px;
		margin: 10px 0 0 10px;
	}
`;
