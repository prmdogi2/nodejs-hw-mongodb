import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import {
  handleGetContacts,
  handleGetContactById,
} from './controllers/contactsController.js';

export function setupServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Routes
  app.get('/contacts', handleGetContacts);
  app.get('/contacts/:contactId', handleGetContactById);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
