import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

// Контроллер для всех контактов
export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

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
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact, // дані створеного контакту
  });
};

// Контролер для видалення контакту
export const deleteStudentController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  // коли контакт вiдсутнiй 
  if (!contact) {
    // створення та налаштування помилки за допомогою http-errors
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
