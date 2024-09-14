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
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

// оновлення контакту
export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return contact;
};
