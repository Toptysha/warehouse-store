import styled from 'styled-components';

export const Loader = () => {
	return (
		<LoaderContainer>
			<div className="overlay"></div>
			<div className="loader"></div>
		</LoaderContainer>
	);
};

const LoaderContainer = styled.div`
	// background-color: red;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 85vh; /* 100% высоты экрана */
	width: 100vw; /* 100% ширины экрана */

	& .overlay {
		position: absolute;
		// background: rgba(0, 0, 0, 0.5);
		width: 100%;
		height: 100%;
	}

	& .box {
		position: relative;
		top: 50%;
		transform: translate(0, -50%);
		background: white;
		margin: auto;
		padding: 20px;
		width: 400px;
		border: 2px solid black;
		border-radius: 5px;
		text-align: center;
	}

	& .loader {
		// margin: 50%;
		width: 45px;
		aspect-ratio: 1;
		--c: no-repeat linear-gradient(#000 0 0);
		background: var(--c), var(--c), var(--c);
		animation:
			l15-1 1s infinite,
			l15-2 1s infinite;
	}

	@keyframes l15-1 {
		0%,
		100% {
			background-size: 20% 100%;
		}
		33%,
		66% {
			background-size: 20% 40%;
		}
	}

	@keyframes l15-2 {
		0%,
		33% {
			background-position:
				0 0,
				50% 100%,
				100% 100%;
		}
		66%,
		100% {
			background-position:
				100% 0,
				0 100%,
				50% 100%;
		}
	}
`;
