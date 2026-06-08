import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// GET ALL
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const userId = req.user._id;

  const contacts = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// GET BY ID
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

// CREATE (CLOUDINARY EKLİ)
export const createContactController = async (req, res) => {
  const userId = req.user._id;

  let photo = null;

  if (req.file) {
    photo = await saveFileToCloudinary(req.file);
  }

  const contact = await createContact(
    {
      ...req.body,
      photo,
    },
    userId,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created!',
    data: contact,
  });
};

// PATCH (CLOUDINARY EKLİ)
export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  let payload = { ...req.body };

  if (req.file) {
    payload.photo = await saveFileToCloudinary(req.file);
  }

  const result = await updateContact(contactId, userId, payload);

  if (!result) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched!',
    data: result.contact,
  });
};

// DELETE
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};