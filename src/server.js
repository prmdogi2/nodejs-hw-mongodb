import express from 'express';
import { getEnvVar } from './utils/env.js';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'; // 1. Adım: Cookie parser import edildi
import logger from './config/logger.js';
import { corsOptions } from './config/cors.js';
import contactsRouter from './routers/contact.js';
import authRouter from './routers/auth.js'; // 2. Adım: Auth router import edildi
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // 1. Güvenlik ve Yardımcı Middleware'ler
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(pinoHttp({ logger }));
  app.use(express.json()); // Body-parser: POST ve PATCH istekleri için zorunlu
  app.use(cookieParser()); // 3. Adım: Çerezleri okuyabilmek için middleware eklendi

  // 2. Ana Rota
  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'Welcome to the Contacts API!',
    });
  });

  // 3. Kaynak Rotaları (CRUD ve Kimlik Doğrulama işlemleri)
  app.use('/auth', authRouter); // 4. Adım: Auth rotaları `/auth` prefix'i ile eklendi
  app.use('/contacts', contactsRouter);

  // 4. Hata Yönetimi (Sıralama kritiktir: Önce 404, en son Error Handler)
  app.use(notFoundHandler); // Hiçbir rotaya eşleşmezse buraya düşer
  app.use(errorHandler); // Next(err) ile gelen tüm hataları yakalar

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};