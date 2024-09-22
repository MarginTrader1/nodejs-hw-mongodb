import createHttpError from 'http-errors';

import { signup } from '../services/auth.js';

// Контролер для регистрации нового юзера
export const signupController = async (req, res) => {
  console.log(`req.body`, req.body);

  const newUser = await signup(req.body);

  console.log(`newUser`, newUser);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser, // дані створеного контакту
  });
};
