import mongoose from 'mongoose';

let cachedConn = null;

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not found in .env. Using fallback data.');
    return null;
  }
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedConn = conn;
    console.log(`🌿 MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    // Non-fatal fallback to JSON data if internet is disconnected
  }
};

