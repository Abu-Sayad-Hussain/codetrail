
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('mobgo uri----->', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/codetrail');
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};