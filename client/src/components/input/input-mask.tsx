import React from 'react';
import ReactInputMask from 'react-input-mask';
import styled from 'styled-components';

export const InputMask = React.forwardRef(({ ...props }: { placeholder?: string; width?: string; onChange?: any }, ref: React.Ref<HTMLInputElement>) => {
	// return <InputMaskContainer mask="+7 (999) 999-99-99" placeholder={placeholder} type={type} width={width} {...props} />;
	return <InputMaskContainer mask="+7 (999) 999-99-99" {...props} />;
});

const InputMaskContainer = styled(ReactInputMask)`
	width: ${({ width = '100%' }) => width};
	height: 40px;
	margin: 10px auto;
	padding: 10px;
	border: 1px solid #000;
	border-radius: 5px;
	font-size: 18px;
`;
