/**
 * AanuBlooms Data Migration Script
 * Seeds existing JSON data from /data/*.json into MongoDB
 * Safe to run multiple times (upsert logic)
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

// Inline schemas for migration
const ProductSchema = new mongoose.Schema({ id: { type: String, unique: true }, slug: { type: String, unique: true } }, { strict: false, timestamps: true });
const CategorySchema = new mongoose.Schema({ id: { type: String, unique: true }, slug: { type: String, unique: true } }, { strict: false, timestamps: true });
const CouponSchema = new mongoose.Schema({ code: { type: String, unique: true } }, { strict: false, timestamps: true });
const SettingSchema = new mongoose.Schema({ key: { type: String, unique: true } }, { strict: false, timestamps: true });
const UserSchema = new mongoose.Schema({ email: { type: String, unique: true } }, { strict: false, timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const readJSON = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`⚠️ Could not read ${filename}:`, err.message);
    return null;
  }
};

async function migrate() {
  console.log('🌸 AanuBlooms Migration Starting...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Migrate Products
  const products = readJSON('products.json');
  if (products && Array.isArray(products)) {
    let added = 0, skipped = 0;
    for (const p of products) {
      if (!p.id) continue;
      const exists = await Product.findOne({ id: p.id });
      if (!exists) {
        const slug = p.slug || (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await Product.create({ ...p, slug, status: p.status || 'active', lowStockThreshold: 3 });
        added++;
      } else {
        skipped++;
      }
    }
    console.log(`📦 Products: ${added} added, ${skipped} already existed`);
  }

  // 2. Migrate Categories
  const categories = readJSON('categories.json');
  if (categories && Array.isArray(categories)) {
    let added = 0, skipped = 0;
    for (const c of categories) {
      if (!c.id && !c.slug) continue;
      const id = c.id || c.slug;
      const slug = c.slug || id;
      const exists = await Category.findOne({ id });
      if (!exists) {
        await Category.create({ ...c, id, slug, status: 'active', displayOrder: c.displayOrder || 0 });
        added++;
      } else {
        skipped++;
      }
    }
    console.log(`🏷️ Categories: ${added} added, ${skipped} already existed`);
  }

  // 3. Migrate Settings
  const settings = readJSON('settings.json');
  if (settings && typeof settings === 'object') {
    const exists = await Setting.findOne({ key: 'global_store_settings' });
    if (!exists) {
      await Setting.create({ ...settings, key: 'global_store_settings' });
      console.log('⚙️ Settings: migrated from settings.json');
    } else {
      console.log('⚙️ Settings: already in MongoDB, skipping');
    }
  }

  // 4. Migrate Coupons
  const coupons = readJSON('coupons.json');
  if (coupons && Array.isArray(coupons)) {
    let added = 0, skipped = 0;
    for (const c of coupons) {
      if (!c.code) continue;
      const exists = await Coupon.findOne({ code: c.code.toUpperCase() });
      if (!exists) {
        await Coupon.create({ ...c, code: c.code.toUpperCase(), usedCount: 0 });
        added++;
      } else {
        skipped++;
      }
    }
    console.log(`🎟️ Coupons: ${added} added, ${skipped} already existed`);
  }

  // 5. Migrate Admin User (if needed)
  const users = readJSON('users.json');
  if (users && Array.isArray(users)) {
    for (const u of users) {
      if (!u.email) continue;
      const exists = await User.findOne({ email: u.email.toLowerCase() });
      if (!exists) {
        await User.create({ ...u, email: u.email.toLowerCase() });
        console.log(`👤 User migrated: ${u.email}`);
      }
    }
  }

  console.log('\n✅ Migration complete!');
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
