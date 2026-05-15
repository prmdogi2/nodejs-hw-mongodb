import express from 'express';
import { getEnvVar } from './utils/env.js';
import pinoHttp from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import logger from './config/logger.js';
import { corsOptions } from './config/cors.js';
import contactsRouter from './routers/contact.js'; // İsimlendirme tutarlılığına dikkat (contact vs contacts)
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // 1. Güvenlik ve Yardımcı Middleware'ler
  app.use(helmet());
  app.use(cors(corsOptions)); // Fix: Obje içinden çıkarıldı
  app.use(pinoHttp({ logger }));
  app.use(express.json()); // Body-parser: POST ve PATCH istekleri için zorunlu

  // 2. Ana Rota
  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'Welcome to the Contacts API!',
    });
  });

  // 3. Kaynak Rotaları (CRUD işlemleri burada toplanıyor)
  app.use('/contacts', contactsRouter);

  // 4. Hata Yönetimi (Sıralama kritiktir: Önce 404, en son Error Handler)
  app.use('*', notFoundHandler); // Hiçbir rotaya eşleşmezse buraya düşer

  app.use(errorHandler); // Next(err) ile gelen tüm hataları yakalar

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};