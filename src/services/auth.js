import { UserCollection } from '../db/models/User.js';

// монгус метод для регистрации нового юзера - возвращает внесенные данные 
export const signup = async (payload) => {
  const user = await UserCollection.create(payload);
  return user;
};
