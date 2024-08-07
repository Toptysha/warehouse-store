export const getISODateString = (day: number, month: number, year: number): string => {
    // Создание объекта Date с установленным временем на 12:00 дня
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
    return date.toISOString();
};
