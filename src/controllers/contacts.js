import mongoose from 'mongoose';
import createHttpError from 'http-errors';

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';


// ========================
// GET ALL
// ========================
export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};


// ========================
// GET BY ID
// ========================
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  // 🔴 FIX: invalid ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};


// ========================
// CREATE
// ========================
export const createContactController = async (req, res) => {
  const { error } = createContactSchema.validate(req.body);

  if (error) {
    throw createHttpError(400, error.message);
  }

  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};


// ========================
// PATCH
// ========================
export const patchContactController = async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);

  if (error) {
    throw createHttpError(400, error.message);
  }

  const { contactId } = req.params;

  // 🔴 FIX: invalid ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};


// ========================
// DELETE
// ========================
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  // 🔴 FIX: invalid ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(404, 'Contact not found');
  }

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};