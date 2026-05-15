export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedContactType = ['work', 'home', 'personal'].includes(contactType) 
    ? contactType 
    : undefined;

  const parsedIsFavourite = isFavourite === 'true' 
    ? true 
    : isFavourite === 'false' 
      ? false 
      : undefined;

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};