import createHttpError from 'http-errors';

// обгортка валидации -> принимает схему валидации и возращает функцию обертку для валидации
export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const error = createHttpError(400, 'Bad Request', {
        errors: err.details,
      });
      next(error);
    }
  };

  // возвращаем функцию
  return func;
};
