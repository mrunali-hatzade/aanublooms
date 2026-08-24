import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const newProducts = [
  {
    id: "prod-category-1",
    slug: "classic-handmade-flower",
    name: "Classic Handmade Flower",
    description: "A beautiful handcrafted flower for any occasion.",
    price: 349,
    category: "forever-blooms",
    images: ["/images/category/1st_category_flower.jpeg"],
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: "prod-category-2",
    slug: "artisan-keychain",
    name: "Artisan Keychain",
    description: "Cute handcrafted keychain.",
    price: 199,
    category: "amigurumi-plushies",
    images: ["/images/category/2nd_category_keychain.jpeg"],
    inStock: true,
    isNew: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod-category-3",
    slug: "decorative-flower-pot",
    name: "Decorative Flower Pot",
    description: "Beautifully designed flower pot.",
    price: 499,
    category: "home-living",
    images: ["/images/category/3rd_category_flowerpot.jpeg"],
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: []
  },
  {
    id: "prod-category-4",
    slug: "forever-bouquet",
    name: "Forever Bouquet",
    description: "A bouquet that lasts a lifetime.",
    price: 999,
    category: "forever-blooms",
    images: ["/images/category/4th_category_bouquet.jpeg"],
    inStock: true,
    isNew: true,
    rating: 5.0,
    reviews: []
  },
  {
    id: "prod-category-5",
    slug: "handmade-gift-set",
    name: "Handmade Gift Set",
    description: "Perfect gift set for your loved ones.",
    price: 799,
    category: "diy-kits-patterns",
    images: ["/images/category/5th_category_ HandmadeGifts.jpeg"],
    inStock: true,
    isNew: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: "prod-category-6",
    slug: "wall-hanging-decor",
    name: "Wall Hanging Decor",
    description: "Elegant wall hanging decor.",
    price: 349,
    category: "bags-accessories",
    images: ["/images/category/Wall Hanging Decor 349.jpeg"],
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: []
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    for (const prod of newProducts) {
      const exists = await Product.findOne({ id: prod.id });
      if (!exists) {
        await Product.create(prod);
        console.log(`Created ${prod.name}`);
      } else {
        await Product.updateOne({ id: prod.id }, prod);
        console.log(`Updated ${prod.name}`);
      }
    }
    console.log('Finished updating products');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
