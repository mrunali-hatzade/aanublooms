import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Category } from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const categoriesFilePath = path.join(__dirname, '../data/categories.json');

const importCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    const data = fs.readFileSync(categoriesFilePath, 'utf8');
    const categories = JSON.parse(data).map(c => ({
      ...c,
      slug: c.id // map id to slug
    }));

    await Category.deleteMany(); // Clear existing
    await Category.insertMany(categories);
    console.log(`Imported ${categories.length} categories successfully.`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing categories:', error);
    process.exit(1);
  }
};

importCategories();
