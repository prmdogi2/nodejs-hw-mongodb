import createHttpError from 'http-errors';

// SIRALAMA: req önce, res sonra gelir
export const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, 'Route not found'));
};