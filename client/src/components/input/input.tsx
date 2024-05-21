import React from 'react';
import styled from 'styled-components';

export const Input = React.forwardRef(
	({ type, placeholder, width, ...props }: { type?: string; placeholder?: string; width?: string; value?: string; onChange?: any }, ref: React.Ref<HTMLInputElement>) => {
		return <InputContainer placeholder={placeholder} type={type} width={width} ref={ref} {...props} />;
	},
);

const InputContainer = styled.input<{ width?: string }>`
	width: ${({ width = '100%' }) => width};
	height: 40px;
	margin: 10px auto;
	padding: 10px;
	border: 1px solid #000;
	border-radius: 5px;
	font-size: 18px;
`;
