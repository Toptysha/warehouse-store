import { SingleValue } from "react-select";
import { request } from "./request";
import { Product, ReactSelectOptionType, UpdatedProduct } from "../interfaces";
import { Dispatch, SetStateAction } from "react";

export const findProductsByArticle = (
	inputValue: SingleValue<string>,
	setSelectedProduct: Dispatch<SetStateAction<SingleValue<string>>>,
	setArticles: Dispatch<SetStateAction<ReactSelectOptionType[]>>,
	setProducts: Dispatch<SetStateAction<UpdatedProduct[]>>
) => {
	if (inputValue) {
		setSelectedProduct(inputValue);

		request(`/products/article`, 'POST', { partOfArticle: inputValue }).then(({ error, data }) => {
			if (error) {
				setArticles([{ value: 'no-match', label: 'Совпадений не найдено' }]);
			} else {
				const dataProducts = data.products.slice(0, 10);
				setArticles(dataProducts.map((product: Product) => ({ value: product.article, label: product.article })));
				if (inputValue === data.products[0]?.article) {
					setProducts((prev) => [
						...prev,
						{
							...data.products[0],
							cover: data.coversUrls[0][data.products[0].id][0],
							oldPrice: data.products[0].price,
							size: data.products[0].sizes[0],
							isDeletedSize: true,
						},
					]);
				}
			}
		});
	} else {
		setSelectedProduct('');
	}
};
