import {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/contacts.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

// Контроллер для всех контактов
export const getAllContactsController = async (req, res) => {
  // пагинация
  const { perPage, page } = parsePaginationParams(req.query);

  // сортування
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });

  // фильтр
  const filter = parseContactsFilterParams(req.query);

  // userId для фільтрації фільмів конкретного юзера
  const { _id: userId } = req.user;

  const contacts = await getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Контроллер для 1 контакта
export const getContactController = async (req, res) => {
  const { contactId } = req.params;

  // передаємо userId щоб отримати контакт конкретного юзера
  const { _id: userId } = req.user;

  const contact = await getContact({ _id: contactId, userId });
  // Відповідь, якщо контакт не знайдено
  if (!contact) {
    // створення та налаштування помилки за допомогою http-errors
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  // Відповідь, якщо контакт знайдено
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

// Контролер для додавання контакту
export const createContactController = async (req, res) => {
  // отримуємо юкзер ID із запиту
  const { _id: userId } = req.user;
  const photo = req.file;
  let photoUrl;

  // если есть фото - перезаписываем url
  if (photo) {
    // Якщо змінна середовища ENABLE_CLOUDINARY встановлена на true
    if (env('ENABLE_CLOUDINARY') === 'true') {
      //фото завантажується на Cloudinary
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      //фото завантажується у локальну директорію
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  // req.body - тело запиту
  const contact = await createContact({ ...req.body, userId, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact, // дані створеного контакту
  });
};

// Контролер для оновлення контакту
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // передаємо userId щоб оновлювати контакти конкретного юзера
  const { _id: userId } = req.user;
  const photo = req.file;
  let photoUrl;

  // если есть фото - перезаписываем url
  if (photo) {
    // Якщо змінна середовища ENABLE_CLOUDINARY встановлена на true
    if (env('ENABLE_CLOUDINARY') === 'true') {
      //фото завантажується на Cloudinary
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      //фото завантажується у локальну директорію
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(
    { _id: contactId, userId },
    { ...req.body, photo: photoUrl },
  );

  // коли контакт вiдсутнiй
  if (!result) {
    // створення та налаштування помилки за допомогою http-errors
    next(createHttpError(404, `Contact with id ${contactId} not found`));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result, // дані створеного контакту
  });
};

// Контролер для видалення контакту
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // передаємо userId щоб видаляти контакти конкретного юзера
  const { _id: userId } = req.user;
  const contact = await deleteContact({ _id: contactId, userId });

  // коли контакт вiдсутнiй
  if (!contact) {
    // створення та налаштування помилки за допомогою http-errors
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
