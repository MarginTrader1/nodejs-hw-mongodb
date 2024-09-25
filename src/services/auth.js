// бибилотека для хеширования паролей
import bcrypt from 'bcrypt';

// пакет в node.js для создания рандомной строки
import { randomBytes } from 'crypto';

import { UserCollection } from '../db/models/User.js';
import { SessionCollection } from '../db/models/Session.js';

import createHttpError from 'http-errors';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

// функция создания сессии
const createSession = () => {
  // токены и время валидности (текущее время + час життя)
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

// монгус метод для регистрации нового юзера - возвращает данные в виде сложного объекта
export const signup = async (payload) => {
  // проверка на наличие юзера в базе данных перед добавлением
  const { email, password } = payload;
  const checkUser = await UserCollection.findOne({ email });
  // если юзер есть - выкидуем ошибку 409
  if (checkUser) {
    throw createHttpError(409, 'Email in use');
  }
  // хешируем пароль = пароль + соль (10 - это уровень для соли) и передаем его в базу данных
  const hashPassword = await bcrypt.hash(password, 10);

  // если нет - создаем новый документ в базе данных
  const user = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  // удаляем пароль из ответа c помощью delete
  delete user._doc.password;

  return user;
};

// монгус метод для логина юзера с помощью сессий
export const signin = async (payload) => {
  const { email, password } = payload;

  // 1) проверка на наличие юзера в базе данных
  const checkUser = await UserCollection.findOne({ email });
  // если юзера нет - выкидуем ошибку 401
  if (!checkUser) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // 2) сравниваем пароль с тем что пришел из базы данных - возвращает true или false
  const comparePassword = await bcrypt.compare(password, checkUser.password);
  // если пароли не совпадают - выкидуем ошибку 401
  if (!comparePassword) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // перед созданием новой сессии удаляем старую сессию если она есть (когда юзер перелогинивается)
  await SessionCollection.deleteOne({ userId: checkUser._id });

  // об'єкт при створенні нової сесії
  const sessionData = createSession();

  // записываем юзер сессию в базу данных
  const userSession = await SessionCollection.create({
    userId: checkUser._id,
    ...sessionData,
  });

  return userSession;
};

// монгус метод для пошуку сесії за accessToken - повертає сесію або null якщо такої немає
export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

// монгус метод для пошуку юзера за ім'ям - повертає юзера або null якщо такого немає
export const findUser = (filter) => UserCollection.findOne(filter);

// монгус метод для оновлення сесії
export const refreshSession = async ({ refreshToken, sessionId }) => {
  // знаходимо стару сесію
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  // якщо сесії немає - викидуємо помилку
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  // якщо строк дії токену закінчився - викидуємо помилку
  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  // видаляємо стару сесію щоб перезаписати
  await SessionCollection.deleteOne({ _id: sessionId });

  // об'єкт при створенні нової сесії
  const sessionData = createSession();

  // записываем юзер сессію в базу данных
  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });

  return userSession;
};

// метод для розлогінювання - видаляє сесію
export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
