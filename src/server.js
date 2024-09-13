import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import contactsRouter from './routers/contacts.js';

const PORT = Number(env('PORT', '3000'));

//функция для старта сервера
export const startServer = () => {
  const app = express();
  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());
  app.use(cors()); // Middleware для CORS

  // Middleware для логування
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Middleware для логування часу запиту
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  // Ответ на начальный путь
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello! What are you looking for?',
    });
  });

  // Ответ на путь /contacts и /contacts/:contactId
  app.use(contactsRouter);

  // Middleware для обробки несуществующих маршрутов
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Middleware для обробких помилок (приймає 4 аргументи)
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
