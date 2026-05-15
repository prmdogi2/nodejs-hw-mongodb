import { ContactsCollection } from '../db/models/contactModel.js';

// 1. Tüm kişileri getirme (Pagination, Sorting, Filtering ile)
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const queryFilter = {};
  if (filter.contactType) {
    queryFilter.contactType = filter.contactType;
  }
  if (typeof filter.isFavourite === 'boolean') {
    queryFilter.isFavourite = filter.isFavourite;
  }

  const [totalItems, data] = await Promise.all([
    ContactsCollection.find(queryFilter).countDocuments(),
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

// 2. Tek bir kişiyi ID ile getirme
export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

// 3. Yeni kişi oluşturma
export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

// 4. Kişiyi güncelleme
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
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

// 5. Kişiyi silme
export const deleteContact = async (contactId) => {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
};