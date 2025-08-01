import mongoose from 'mongoose';

let cachedDb: mongoose.Connection | null = null;

export async function connectDB(): Promise<mongoose.Connection> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = connection.connection;
    
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (cachedDb) {
    await mongoose.disconnect();
    cachedDb = null;
  }
} 