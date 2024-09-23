import createHttpError from 'http-errors';

// імпорт сервісів для пошуку в базі даних - монгус методи
import { findSessionByAccessToken, findUser } from '../services/auth.js';

// мідлвара для проверки валидности токена
export const authenticate = async (req, res, next) => {
  // отримуємо заголовок
  const authorization = req.get('Authorization');

  //якщо заголовок не передали - викидуємо помилку
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header not found'));
  }

  // превращаем строку в массив для проверки токена
  const [bearer, token] = authorization.split(' ');

  // якщо немає слова "Bearer" - то викидуємо помилку
  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authorization header must have Bearer type'),
    );
  }

  // отримуємо сесію за токеном
  const session = await findSessionByAccessToken(token);

  // якщо сесії немає - викидуємо помилку
  if (!session) {
    return next(createHttpError(401, 'Session not found, please login'));
  }

  // якщо сесію знайшли, то перевіряємо строк дії токена
  // якщо теперішня дата більша - то час дії токена закінчився та викидуємо помилку
  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // перевірка чи є взагалі такий юзер в базі даних (можливо має токен, але вже видалили)
  // отримуємо юзера за userId
  const user = await findUser({ _id: session.userId });

  // якщо юзера немає (null) - то викидуємо помилку
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  // передаємо дані користувача далі для використання, так як
  // об'єкт req він один для усіх мідлвар, і коли ми його перезаписуємо, то це поле 
  // req.user стає доступним в інших мідлварах та контролерах   
  req.user = user;

  // якщо все добре, перевірки успішні - виходимо із мідлвари
  next();
};
