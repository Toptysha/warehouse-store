import { StylesConfig } from "react-select";
import { ReactSelectOptionType } from "../interfaces";

export const reactSelectStyles = (maxHeight: string): StylesConfig<ReactSelectOptionType, false> => {
	const reactSelectStyles: StylesConfig<ReactSelectOptionType, false> = {
	  menu: (provided) => ({
		...provided,
		maxHeight,
		overflowY: 'auto',
	  }),
	  menuList: (provided) => ({
		...provided,
		maxHeight: 'none',
	  }),
	};

	return reactSelectStyles;
  };
