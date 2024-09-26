import Joi from 'joi';

// Joi схема для валидации email при скидання паролю 
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
