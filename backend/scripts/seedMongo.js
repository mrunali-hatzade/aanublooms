import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Setting } from '../models/Setting.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');

const readJSON = (filename) => {
  try {
    const raw = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Could not read ${filename}:`, err.message);
    return null;
  }
};

const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Seed Products
    const productsData = readJSON('products.json');
    if (productsData && Array.isArray(productsData)) {
      await Product.deleteMany({});
      await Product.insertMany(productsData);
      console.log(`🌸 Migrated ${productsData.length} Products to MongoDB Atlas`);
    }

    // 2. Seed Users
    const usersData = readJSON('users.json');
    if (usersData && Array.isArray(usersData)) {
      await User.deleteMany({});
      await User.insertMany(usersData);
      console.log(`👤 Migrated ${usersData.length} Users to MongoDB Atlas`);
    }

    // 3. Seed Orders
    const ordersData = readJSON('orders.json');
    if (ordersData && Array.isArray(ordersData)) {
      await Order.deleteMany({});
      await Order.insertMany(ordersData);
      console.log(`📦 Migrated ${ordersData.length} Orders to MongoDB Atlas`);
    }

    // 4. Seed Settings
    const settingsData = readJSON('settings.json');
    if (settingsData) {
      await Setting.deleteMany({});
      await Setting.create({
        key: 'global_store_settings',
        ...settingsData
      });
      console.log('⚙️ Migrated Store Settings to MongoDB Atlas');
    }

    console.log('\n🎉 ALL STORE DATA SUCCESSFULLY MIGRATED TO MONGODB ATLAS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  }
};

seedDatabase();
