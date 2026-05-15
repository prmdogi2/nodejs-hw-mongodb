import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// ========================
// GET ALL (Sayfalandırma, Sıralama, Filtreleme eklendi)
// ========================
export const getAllContactsController = async (req, res) => {
  // Query parametrelerini ayrıştır
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const co
  ntacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts, // Artık meta verileri (page, totalItems vb.) içeren obje döner
  });
};

// ========================
// GET BY ID
// ========================
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  // NOT: isValidId kontrolü artık Router seviyesinde middleware olarak yapılıyor.
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
  // NOT: validateBody kontrolü artık Router seviyesinde middleware olarak yapılıyor.
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
  const { contactId } = req.params;

  // NOT: validateBody ve isValidId kontrolü artık Router seviyesinde.
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

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};