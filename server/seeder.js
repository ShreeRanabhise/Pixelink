import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Png from './models/Png.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const categoriesData = [
  { name: 'Nature', slug: 'nature', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Animals', slug: 'animals', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Vehicles', slug: 'vehicles', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Abstract', slug: 'abstract', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Technology', slug: 'technology', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Food', slug: 'food', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Business', slug: 'business', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Sports', slug: 'sports', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Architecture', slug: 'architecture', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Art', slug: 'art', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Space', slug: 'space', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Gaming', slug: 'gaming', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Music', slug: 'music', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Fashion', slug: 'fashion', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Medical', slug: 'medical', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Education', slug: 'education', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Travel', slug: 'travel', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Holidays', slug: 'holidays', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Characters', slug: 'characters', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  { name: 'Objects', slug: 'objects', image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Clear existing data (optional, but requested to add 20 categories and 30 pngs each)
    // If you don't want to clear, comment these out. Let's not clear just in case they have data they want to keep.
    // Wait, the easiest way to avoid duplicate key errors on category slug is to clear or handle it gracefully.
    // I will check if categories exist and create them if not.

    const createdCategories = [];

    for (const catData of categoriesData) {
      let category = await Category.findOne({ slug: catData.slug });
      if (!category) {
        category = await Category.create(catData);
        console.log(`Created category: ${category.name}`);
      }
      createdCategories.push(category);
    }

    console.log(`Ensured ${createdCategories.length} categories exist.`);

    // Now insert 30 PNGs for each category
    let totalInserted = 0;
    
    for (const category of createdCategories) {
      const pngsToInsert = [];
      for (let i = 1; i <= 30; i++) {
        const uniqueId = new mongoose.Types.ObjectId().toString();
        pngsToInsert.push({
          title: `${category.name} Item ${i}`,
          slug: `${category.slug}-item-${i}-${uniqueId.substring(0, 6)}`,
          description: `A sample high-quality transparent PNG image representing ${category.name}.`,
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.png',
          category: category._id,
          tags: [category.name.toLowerCase(), 'sample', 'transparent', 'png', `item${i}`],
          downloads: Math.floor(Math.random() * 500),
          views: Math.floor(Math.random() * 2000),
          likes: Math.floor(Math.random() * 100),
          approved: true,
        });
      }
      
      await Png.insertMany(pngsToInsert);
      totalInserted += 30;
      console.log(`Inserted 30 PNGs for category: ${category.name}`);
    }

    console.log(`Data Import Success! Total PNGs inserted: ${totalInserted}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
