import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  console.log(`API:`, contactId);

  const contact = await ContactsCollection.findById(contactId);
  console.log(`after contact API:`, contact);
  return contact;
};
