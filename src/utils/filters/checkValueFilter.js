// функции проверки значений поля - передали или нет
// если не передали нужно вернуть undefined через return без ничего

export const checkValueFilterType = (value, array) => {
  const type = array.includes(value) ? value : undefined;
  return type;
};

export const checkValueIsFavourite = (value) => {
  if (value === 'true' || value === 'false') return value;
  return undefined;
};
