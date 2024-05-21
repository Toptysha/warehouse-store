import styled from 'styled-components';
import { Button } from '../button/button';
import { useSelector } from 'react-redux';
import { selectApp } from '../../redux/selectors';

export const Modal = () => {
	const modal = useSelector(selectApp).modal;

	if (!modal.isOpen) {
		return null;
	}

	return (
		<ModalContainer>
			<div className="overlay"></div>
			<div className="box">
				<h3>{modal.text}</h3>
				<div className="buttons">
					<Button description="Да" onClick={modal.onConfirm} />
					<Button description="Отмена" onClick={modal.onCancel} />
				</div>
			</div>
		</ModalContainer>
	);
};

const ModalContainer = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 20;

	& button {
		width: 120px;
		margin: 10px auto;
	}

	& .buttons {
		margin-top: 20px;
		display: flex;
	}

	& .overlay {
		position: absolute;
		background: rgba(0, 0, 0, 0.5);
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
`;
