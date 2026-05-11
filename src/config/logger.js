import pino from 'pino';

// Ortamın production olup olmadığını kontrol et
const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: 'info',
  // Eğer production ortamındaysak pino-pretty kullanma (standart JSON log bas)
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      contentLength: res.getHeader('content-length'),
    }),
  },
});

export default logger;