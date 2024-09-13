import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

// контроллер для всех контактов
export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// контроллер для 1 контакта
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  console.log(`contactId:`, contactId);

  const contact = await getContactById(contactId);

  console.log(`contact:`, contact);

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
