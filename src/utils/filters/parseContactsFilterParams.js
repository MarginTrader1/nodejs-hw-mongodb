import {
  checkValueFilterType,
  checkValueIsFavourite,
} from './checkValueFilter.js';

import { typeList } from '../../constants/contact.js';

export const parseContactsFilterParams = ({ type, isFavourite }) => {

  const parsedType = checkValueFilterType(type, typeList);
  const parsedIsFavourite = checkValueIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
