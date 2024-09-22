import createHttpError from 'http-errors';

import { signup, signin } from '../services/auth.js';

// Контролер для регистрации нового юзера
export const signupController = async (req, res) => {
  const newUser = await signup(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser, // дані створеного контакту
  });
};

export const signinController = async (req, res) => {
  const userSession = await signin(req.body);

  // refreshToken передаем в куках
  res.cookie('refreshToken', userSession.refreshToken, {
    // опция когда фронт енд не видит токен
    httpOnly: true,
    // + передаем время валидности
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  // передаем ID сессии + время валидности
  res.cookie('sessionId', userSession._id, {
    httpOnly: true,
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  // при успешном логине в ответ передаем accessToken, 
  // чтобы его мог использовать фронтенд для запросов 
  res.json({
    status: 200,
    message: 'Successfully signin',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};
