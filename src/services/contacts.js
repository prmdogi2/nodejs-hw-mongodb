import { ContactsCollection } from '../db/models/contactModel.js';

// 1. Tüm kişileri getirme (Pagination, Sorting, Filtering ve USERID ile)
export const getAllContacts = async ({
  userId, // Kullanıcı id'sini parametre olarak alıyoruz
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  // Sadece giriş yapan kullanıcının kişilerini getirmek için filtreye ekliyoruz
  const queryFilter = { userId };
  
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

// 2. Tek bir kişiyi ID ve USERID ile getirme (Başkası erişemesin)
export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

// 3. Yeni kişi oluşturma (Kişiye USERID atayarak)
export const createContact = async (payload, userId) => {
  return await ContactsCollection.create({ ...payload, userId });
};

// 4. Kişiyi güncelleme (Sadece sahibiyse güncellemeye izin verir)
export const updateContact = async (contactId, userId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId }, // Hem kişi ID'sini hem de kullanıcı ID'sini arıyoruz
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

// 5. Kişiyi silme (Sadece sahibiyse silmeye izin verir)
export const deleteContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId, // Kullanıcı eşleşmesi zorunlu
  });
};