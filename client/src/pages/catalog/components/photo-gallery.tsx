import { Slide } from 'react-slideshow-image';
import { SliderArrow } from './slider-arrow';
import { COLORS } from '../../../constants';
import 'react-slideshow-image/dist/styles.css';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const buttonStyle = {
	width: '33px',
	background: 'none',
	border: '0px',
	margin: '0 5px',
};

const divStyle = {
	backgroundColor: `${COLORS.BACKGROUND}`,
	width: '300px',
	height: '300px',
	borderRadius: '10px',
};

const spanStyle = {
	display: 'inline-block',

	backgroundSize: 'cover',
	width: '290px',
	height: '290px',
	borderRadius: '10px',
	margin: '5px',
};

const arrowsProperties = {
	prevArrow: (
		<button style={{ ...buttonStyle }}>
			<SliderArrow $arrowDirection="left" />
		</button>
	),
	nextArrow: (
		<button style={{ ...buttonStyle }}>
			<SliderArrow $arrowDirection="right" />
		</button>
	),
};

export const PhotoGallery = ({ images, path }: { images: string[]; path?: string }) => {
	return (
		<PhotoGalleryContainer>
			<Slide autoplay={false} onChange={function noRefCheck() {}} onStartChange={function noRefCheck() {}} {...arrowsProperties}>
				{images.map((image, index) => (
					<div className="each-slide-effect" key={index}>
						<div style={{ ...divStyle }}>
							<Link to={path || ''}>
								<span style={{ ...spanStyle, backgroundImage: `url(${image})` }}></span>
							</Link>
						</div>
					</div>
				))}
			</Slide>
		</PhotoGalleryContainer>
	);
};

const PhotoGalleryContainer = styled.div`
	width: 300px;
	height: 300px;
`;
