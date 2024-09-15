import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/contact.js';

// отримання усих контактов
export const getAllContacts = async (
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
) => {
  // формула сколько пропустить вначале
  const skip = (page - 1) * perPage;

  // методы: skip - сколько пропустить, limit - сколько взять после пропуска
  const contacts = await ContactsCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder }); // объект налаштувань для сортування {поле: порядок}

  // метод countDocuments() - количество объектов в базе
  const count = await ContactsCollection.find().countDocuments();

  const paginationData = calculatePaginationData(count, perPage, page);

  return {
    contacts: contacts,
    page,
    perPage,
    totalItems: count,
    ...paginationData,
  };
};

// отримання 1 контакту
export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

// створення та додавання контакту
export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

// видалення контакту
export const deleteContact = async (contactId) => {
  const result = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return result;
};

// оновлення контакту
export const updateContact = async (contactId, payload, options = {}) => {
  const { lastErrorObject, value } = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      new: true, // опция для возращения обновленного контакта
      includeResultMetadata: true,
      ...options,
    },
  );

  // если контакта по id нет - верни null
  if (lastErrorObject.updatedExisting === false) return null;

  // если есть - возращается обновленный контакт
  return value;
};
