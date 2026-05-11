import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // 1. Eğer bu bir HttpError (404, 401 vb.) ise
  if (isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.name, // Örn: "NotFoundError"
      data: err.message, // Örn: "Contact not found"
    });
    return;
  }

  // 2. Beklenmedik bir hata ise (500)
  // Ödev tam olarak bu formatı (status: 500 ve "Something went wrong") istiyor
  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,
  });
};