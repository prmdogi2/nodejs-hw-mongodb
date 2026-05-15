export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseInt(page) > 0 ? parseInt(page) : 1;
  const parsedPerPage = parseInt(perPage) > 0 ? parseInt(perPage) : 10;

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};