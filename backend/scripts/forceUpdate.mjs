import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

async function forceUpdate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const catData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/categories.json')));
  for (const c of catData) {
    const id = c.id || c.slug;
    await Category.findOneAndUpdate({ id }, { $set: { image: c.image } });
  }

  const prodData = JSON.parse(await fs.readFile(path.join(__dirname, '../data/products.json')));
  for (const p of prodData) {
    if (p.id) {
      await Product.findOneAndUpdate({ id: p.id }, { $set: { images: p.images } });
    }
  }

  console.log('Images forcefully updated!');
  process.exit(0);
}
forceUpdate();
