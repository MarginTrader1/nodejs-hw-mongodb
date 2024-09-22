import { UserCollection } from '../db/models/User.js';

// монгус метод для регистрации нового юзера - возвращает данные в виде сложного объекта
export const signup = async (payload) => {
  const user = await UserCollection.create(payload);

  // удаляем пароль из ответа c помощью delete
  delete user._doc.password;

  return user;
};
