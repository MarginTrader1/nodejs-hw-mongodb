import { SORT_ORDER } from '../constants/contact.js';

export const parseSortParams = ({ sortBy, sortFields, sortOrder }) => {
  // по умолчанию - сортування по ID
  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';

  // по умолчанию - первый в массиве
  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
