import { ContactsCollection } from '../db/models/contactModel.js';

// 1. Tüm kişileri getirme
export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const queryFilter = { userId };

  if (filter.contactType) {
    queryFilter.contactType = filter.contactType;
  }

  if (typeof filter.isFavourite === 'boolean') {
    queryFilter.isFavourite = filter.isFavourite;
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.countDocuments(queryFilter),
    ContactsCollection.find(queryFilter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// 2. Tek contact getirme
export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

// 3. Contact oluşturma
export const createContact = async (payload, userId) => {
  return await ContactsCollection.create({
    ...payload,
    userId,
  });
};

// 4. Contact güncelleme
export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.updatedExisting === false),
  };
};

// 5. Contact silme
export const deleteContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};