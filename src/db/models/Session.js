import { model, Schema } from 'mongoose';

import { handleSaveError, setUpdateOptions } from './hooks.js';

// схема для валидации юзера при добавлении в базу данных
export const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users', // привязка к коллекции users в базе данных
    required: true,
  },
  // 2 токена доступа для сессии
  // access токен для доступа - маэ невеликий час життя
  accessToken: {
    type: String,
    required: true,
  },
  // refresh токен - для оновлення accessToken, коли його час життя завершиться
  refreshToken: {
    type: String,
    required: true,
  },
  // час життя
  accessTokenValidUntil: {
    type: Date,
    required: true,
  },
  refreshTokenValidUntil: {
    type: Date,
    required: true,
  },
});

sessionSchema.post('save', handleSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateOptions);

sessionSchema.post('findOneAndUpdate', handleSaveError);

export const SessionCollection = model('session', sessionSchema);
