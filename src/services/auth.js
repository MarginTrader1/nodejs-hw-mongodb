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

// блок импортов для надсилання повыдомлення для скидання паролю
import jwt from 'jsonwebtoken';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

// блок импортов для создания шаблонного сообщения
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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

// метод для пошуку юзера за email - для скидання паролю
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // створення JWT токену
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  // надсилаемо сообщение с настройками
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

// метод для скидання паролю
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};