import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const hashedPassword = await bcrypt.hash('adminpassword123', 10);

  // 1. Primary admin account
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@aanublooms.com' },
    {
      $set: {
        id: 'admin-primary',
        name: 'Aanu (Artisan Founder)',
        email: 'admin@aanublooms.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91 95791 62154',
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
  console.log('✅ admin@aanublooms.com password set to: adminpassword123');

  // 2. Founder gmail account (also admin for convenience)
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'aanublooms@gmail.com' },
    {
      $set: {
        id: 'admin-founder',
        name: 'Aanurvi Ghatole (Founder)',
        email: 'aanublooms@gmail.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91 95791 62154',
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
  console.log('✅ aanublooms@gmail.com password set to: adminpassword123');

  await mongoose.disconnect();
  console.log('Finished.');
}

resetAdmin().catch(console.error);
