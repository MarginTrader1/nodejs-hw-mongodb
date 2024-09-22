import { UserCollection } from '../db/models/User.js';
import createHttpError from 'http-errors';

// монгус метод для регистрации нового юзера - возвращает данные в виде сложного объекта
export const signup = async (payload) => {
  // проверка на наличие юзера в базе данных перед добавлением
  const { email } = payload;
  const checkUser = await UserCollection.findOne({ email });
  // если юзер есть - выкидуем ошибку 409
  if (checkUser) {
    throw createHttpError(409, 'Email already exist');
  }

  // если нет - создаем новый документ в базе данных
  const user = await UserCollection.create(payload);

  // удаляем пароль из ответа c помощью delete
  delete user._doc.password;

  return user;
};
