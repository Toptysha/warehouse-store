import Select, { InputActionMeta, SingleValue } from 'react-select';
import { Button, SelectedProductsForOrder } from '../../../components';
import { OrderInfoExchangeType, ReactSelectOptionType, UpdatedProduct } from '../../../interfaces';
import { findProductsByArticle, reactSelectStyles } from '../../../utils';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

export const OneSaleExchangeProducts = ({
	initialProducts,
	products,
	setProducts,
	selectedProduct,
	setSelectedProduct,
	articles,
	setArticles,
	setExchangeType,
	setIsExchangeProducts,
	setIsCancelledDeal,
}: {
	initialProducts: UpdatedProduct[];
	products: UpdatedProduct[];
	setProducts: Dispatch<SetStateAction<UpdatedProduct[]>>;
	selectedProduct: SingleValue<string>;
	setSelectedProduct: Dispatch<SetStateAction<SingleValue<string>>>;
	articles: ReactSelectOptionType[];
	setArticles: Dispatch<SetStateAction<ReactSelectOptionType[]>>;
	setExchangeType: Dispatch<SetStateAction<OrderInfoExchangeType>>;
	setIsExchangeProducts: Dispatch<SetStateAction<boolean>>;
	setIsCancelledDeal: Dispatch<SetStateAction<boolean>>;
}) => {
	const handleInputChange = (inputValue: string, actionMeta: InputActionMeta) => {
		if (actionMeta.action === 'input-change') {
			findProductsByArticle(inputValue, setSelectedProduct, setArticles, setProducts);
		}
	};

	const isCancelledDeal = initialProducts.length === 0;

	return (
		<OneSaleExchangeProductsContainer>
			<div className="buttons">
				<Button
					description={`Сохранить изменения?`}
					width="200px"
					onClick={() => {
						setExchangeType('saveExchange');
					}}
				/>
				<Button
					description={`Отмена`}
					width="80px"
					onClick={() => {
						isCancelledDeal && setIsCancelledDeal(true);
						!isCancelledDeal && setProducts(initialProducts);
						setIsExchangeProducts(false);
					}}
				/>
			</div>
			<div className="form-point">
				<div className="products-title">Измененный заказ:</div>
				<Select
					className="select-products"
					value={selectedProduct ? { value: selectedProduct, label: selectedProduct } : null}
					onChange={(option: SingleValue<ReactSelectOptionType>) => findProductsByArticle(option ? option.value : '', setSelectedProduct, setArticles, setProducts)}
					onInputChange={handleInputChange}
					options={articles}
					isClearable
					isSearchable
					noOptionsMessage={() => 'Нет совпадений'}
					placeholder="Введите артикул товара"
					styles={reactSelectStyles('200px')}
				/>
			</div>
			<SelectedProductsForOrder products={products} setProducts={setProducts} isLastProduct={products.filter(({ size }) => !!size).length === 1} $width="490px" $height="950px" />
		</OneSaleExchangeProductsContainer>
	);
};

const OneSaleExchangeProductsContainer = styled.div`
	width: 500px;
`;
