import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

// проверка валидного ID
export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  // если id неправильный - выбрасываем ошибку
  if (!isValidObjectId(contactId)) {
    // створення та налаштування помилки за допомогою http-errors
    // return тому що next не перерывае виконання функции а треба переривати
    return next(createHttpError(404, `${contactId} is not valid ID`));
  }
  next();
};

// return next(error) = throw error