import createHttpError from 'http-errors';

import { signup, signin, refreshSession } from '../services/auth.js';

// функції передачі налаштувань сесії в кукі для фроненду
const setupSession = (res, session) => {
  // refreshToken передаем в куках
  res.cookie('refreshToken', session.refreshToken, {
    // опция когда фронт енд не видит токен
    httpOnly: true,
    // + передаем время валидности
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });

  // передаем ID сессии + время валидности
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
};

// Контролер для регистрации нового юзера
export const signupController = async (req, res) => {
  const newUser = await signup(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser, // дані створеного контакту
  });
};

// Котролер для логіна юзера
export const signinController = async (req, res) => {
  const userSession = await signin(req.body);

  // при успешном логине в ответ передаем accessToken,
  // чтобы его мог использовать фронтенд для запросов
  setupSession(res, userSession);

  res.json({
    status: 200,
    message: 'Successfully signin',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  // отримуемо refresh токен и сесію із куків
  const { refreshToken, sessionId } = req.cookies;

  // оновлюємо сесію - повертається налаштування нової сесії
  const refreshedSession = await refreshSession({
    refreshToken,
    sessionId,
  });

  // при успешном логине в ответ передаем refreshToken
  // для використання на фронтенді
  setupSession(res, refreshedSession);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: refreshedSession.accessToken,
    },
  });
};
