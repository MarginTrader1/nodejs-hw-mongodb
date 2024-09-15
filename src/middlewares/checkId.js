// функция mongoose для проверки ID на валидность 
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// проверка валидного ID
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  // если id не валидный - выбрасываем ошибку
  if (!isValidObjectId(contactId)) {
    // помилки за допомогою http-errors
    // return тому що next не перерывае виконання функции а треба переривати
    return next(createHttpError(404, `${contactId} is not valid ID`));
  }
  next();
};

// return next(error) = throw error