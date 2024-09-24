import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/contacts.js';
import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';

// Контроллер для всех контактов
export const getAllContactsController = async (req, res) => {
  // пагинация
  const { perPage, page } = parsePaginationParams(req.query);

  // сортування
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });

  // фильтр
  const filter = parseContactsFilterParams(req.query);
  const contacts = await getAllContacts(
    perPage,
    page,
    sortBy,
    sortOrder,
    filter,
  );
  
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Контроллер для 1 контакта
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  // Відповідь, якщо контакт не знайдено
  if (!contact) {
    // створення та налаштування помилки за допомогою http-errors
    throw createHttpError(404, 'Contact not found');
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
  // req.body - тело запиту
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact, // дані створеного контакту
  });
};

// Контролер для оновлення контакту
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

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
  const contact = await deleteContact(contactId);

  // коли контакт вiдсутнiй
  if (!contact) {
    // створення та налаштування помилки за допомогою http-errors
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
