import mongoose from 'mongoose';
import { Contact } from '../db/models/contactModel.js';

export async function getAllContacts() {
  return await Contact.find();
}

export async function getContactById(contactId) {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return null;
  }

  return await Contact.findById(contactId);
}
