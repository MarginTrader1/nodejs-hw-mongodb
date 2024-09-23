const parseInteger = (value, defaultValue) => {
  // если не строка - задаем дефолтное значение
  if (typeof value !== 'string') return defaultValue;

  // целое число
  const number = parseInt(value);

  // если передали строку вместо числа - задаем дефолтное значение
  if (Number.isNaN(number)) return defaultValue;

  return number;
};

// функция для проверки чисел для пагинации
export const parsePaginationParams = ({ perPage, page }) => {
  const parsedperPage = parseInteger(perPage, 10);
  const parsedPage = parseInteger(page, 1);

  console.log(`parsedperPage in parsePaginationParams`, parsedperPage);
  console.log(`parsedPage in parsePaginationParams`, parsedPage);

  return {
    perPage: parsedperPage,
    page: parsedPage,
  };
};
