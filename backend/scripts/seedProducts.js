import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const productsFilePath = path.join(__dirname, '../data/products.json');

const importData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    const data = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(data);

    await Product.deleteMany(); // Clear existing products
    console.log('Cleared existing products.');

    await Product.insertMany(products);
    console.log(`Imported ${products.length} products successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
