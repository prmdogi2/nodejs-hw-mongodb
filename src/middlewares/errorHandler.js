import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // 🔴 CastError FIX (Mongo ObjectId hatası)
  if (err.name === 'CastError') {
    err = createHttpError(404, 'Contact not found');
  }

  // 🔴 HttpError ise (404, 400 vs.)
  if (err.status) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: undefined,
    });
  }

  // 🔴 fallback 500
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};