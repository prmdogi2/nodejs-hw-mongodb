import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  
  // Giriş yapan kullanıcının ID'sini alıyoruz
  const userId = req.user._id;

  // userId bilgisini servise parametre olarak ekledik
  const contacts = await getAllContacts({ userId, page, perPage, sortBy, sortOrder, filter });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Kullanıcı ID'si

  // Servise contactId ile birlikte userId'yi de gönderiyoruz
  const contact = await getContactById(contactId, userId);
  if (!contact) throw createHttpError(404, 'Contact not found');
  
  res.status(200).json({ status: 200, message: `Successfully found contact!`, data: contact });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id; // Kullanıcı ID'si

  // Yeni kişi oluşturulurken sahibinin kim olduğunu servise bildiriyoruz
  const contact = await createContact(req.body, userId);
  res.status(201).json({ status: 201, message: 'Successfully created!', data: contact });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Kullanıcı ID'si

  // Sadece bu kullanıcıya aitse güncellenmesi için userId'yi geçiyoruz
  const result = await updateContact(contactId, userId, req.body);
  if (!result) throw createHttpError(404, 'Contact not found');
  
  res.status(200).json({ status: 200, message: 'Successfully patched!', data: result.contact });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; // Kullanıcı ID'si

  // Sadece bu kullanıcıya aitse silinmesi için userId'yi geçiyoruz
  const contact = await deleteContact(contactId, userId);
  if (!contact) throw createHttpError(404, 'Contact not found');
  
  res.status(204).send();
};