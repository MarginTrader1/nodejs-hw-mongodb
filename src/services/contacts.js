import { ContactsCollection } from '../db/models/contacts.js';

// отримання усих контактов
export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
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
