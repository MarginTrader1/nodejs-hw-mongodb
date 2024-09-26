import Joi from 'joi';

// Joi схема для валидации email при скидання паролю 
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Joi схема для валидации нового паролю 
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});