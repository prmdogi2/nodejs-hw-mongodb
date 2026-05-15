export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortOrder = ['asc', 'desc'].includes(sortOrder)
    ? sortOrder
    : 'asc';

  const parsedSortBy = typeof sortBy === 'string' ? sortBy : 'name';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};