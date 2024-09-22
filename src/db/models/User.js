import { model, Schema } from 'mongoose';

import { emailRegexp } from '../../constants/users.js';

import { handleSaveError, setUpdateOptions } from './hooks.js';

// схема для валидации юзера при добавлении в базу данных
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true, // вказуемо для базы данных що email мае бути уныкальним
      match: emailRegexp, // проверка валидности почти с помощью регулярного выражения
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', setUpdateOptions);

userSchema.post('findOneAndUpdate', handleSaveError);

export const UserCollection = model('users', userSchema);
