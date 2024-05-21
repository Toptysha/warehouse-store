export const sortSizes = (sizes: string[]): string[] => {
	return sizes.sort((a, b) => {
		// Извлекаем числовые значения из строк
		const numA = parseInt(a, 10);
		const numB = parseInt(b, 10);

		if (numA === numB) {
		  if (a.includes('-') && b.includes('-')) {
			return b.localeCompare(a);
		  }
		  return 0;
		}

		return numA - numB;
	  });
}
