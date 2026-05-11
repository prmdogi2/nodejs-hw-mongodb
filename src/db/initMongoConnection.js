import mongoose from 'mongoose';

export async function initMongoConnection() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not found in environment variables!');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
}