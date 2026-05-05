import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import { initMongoConnection } from './db/models/initMongoConnection.js';

async function start() {
  try {
    console.log('Starting Mongo connection...');
    await initMongoConnection();

    console.log('Mongo connected, starting server...');
    const app = setupServer();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

start();
