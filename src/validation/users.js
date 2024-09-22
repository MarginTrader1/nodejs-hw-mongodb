import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

// Joi схема для валидации юзера при регистрации
export const userSignupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

// Joi схема для валидации юзера при логине
export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
