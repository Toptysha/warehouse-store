import { StylesConfig } from "react-select";
import { ReactSelectOptionType } from "../interfaces";

export const reactSelectStyles = (maxHeight: string) => {
	const reactSelectStyles: StylesConfig<ReactSelectOptionType, false> = {
			menu: (provided) => ({
			...provided,
			maxHeight,
			overflowY: 'auto',
		})
	}

	return reactSelectStyles;
};
