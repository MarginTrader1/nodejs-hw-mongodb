import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

// роутер для контактов
import contactsRouter from './routers/contacts.js';

// роутер для ресгитрации
import authRouter from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { timeLogging } from './middlewares/timeLogging.js';
import { firstPage } from './middlewares/firstPage.js';

const PORT = Number(env('PORT', '3000'));

//функция для старта сервера
export const startServer = () => {
  const app = express();
  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());

  // Middleware для CORS
  app.use(cors());

  // Middleware для логування
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  // Middleware для логування часу запиту
  app.use(timeLogging);

  // Ответ на начальный путь
  app.get('/', firstPage);

  // Ответ на путь для регистрации
  app.use(authRouter);

  // Ответ на путь /contacts и /contacts/:contactId
  app.use(contactsRouter);

  // Middleware для обробки несуществующих маршрутов
  app.use('*', notFoundHandler);

  // Middleware для обробких помилок (приймає 4 аргументи)
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
