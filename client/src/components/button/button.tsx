import styled from 'styled-components';

export const Button = ({
	description,
	type,
	disabled = false,
	className,
	onClick,
	...props
}: {
	description: string;
	type?: any;
	disabled?: boolean;
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
	return (
		<ButtonContainer className={className} type={type} disabled={disabled} onClick={onClick} {...props}>
			{description}
		</ButtonContainer>
	);
};

const ButtonContainer = styled.button`
	background-color: #fff;
	width: '100%';
	height: 40px;
	margin: 10px auto;
	padding: 5px;
	border: 1px solid #000;
	border-radius: 5px;
	font-size: 18px;
	cursor: pointer;
`;
