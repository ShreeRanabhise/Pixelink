import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Png from '../models/Png.js';

dotenv.config();

// Helper to generate slugs
const slugify = (text) => text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

// Tiny transparent 1x1 base64 PNG data for placeholder
const MOCK_PNG_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkXmU6LuwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAd0lEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBlMIAAE3h1d0AAAAAElFTkSuQmCC';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pngworld');
    console.log('Connected to MongoDB for realistic seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Png.deleteMany();
    console.log('Database wiped entirely.');

    // 1. Create Admin
    const adminUser = await User.create({
      email: 'admin@pngworld.com',
      password: 'admin12345',
      role: 'admin',
    });
    console.log('Admin user recreated: admin@pngworld.com');

    // 2. Generate 200 Unique Categories
    console.log('Generating 200 realistic categories...');
    const categoriesData = [];
    const usedCategoryNames = new Set();

    while (categoriesData.length < 200) {
      const adjective = faker.commerce.productAdjective();
      const department = faker.commerce.department();
      const catName = `${adjective} ${department}`;
      
      if (!usedCategoryNames.has(catName)) {
        usedCategoryNames.add(catName);
        categoriesData.push({
          name: catName,
          slug: slugify(catName),
          description: faker.commerce.productDescription(),
          image: faker.image.urlLoremFlickr({ category: department.toLowerCase() }),
        });
      }
    }

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Successfully seeded ${seededCategories.length} categories.`);

    // 3. Generate 10 PNGs per Category (2000 total)
    console.log('Generating 2000 realistic PNG assets (10 per category)...');
    const pngsData = [];
    const usedPngSlugs = new Set();
    
    for (let i = 0; i < seededCategories.length; i++) {
      const currentCategory = seededCategories[i];
      
      for (let j = 1; j <= 10; j++) {
        let title = faker.commerce.productName();
        let slug = slugify(title);
        
        // Ensure unique slug
        while (usedPngSlugs.has(slug)) {
          title = faker.commerce.productName() + ' ' + faker.string.alphanumeric(4);
          slug = slugify(title);
        }
        usedPngSlugs.add(slug);

        const tags = Array.from(new Set([
          faker.commerce.productMaterial().toLowerCase(),
          faker.commerce.productAdjective().toLowerCase(),
          faker.word.noun().toLowerCase(),
          faker.word.noun().toLowerCase()
        ]));

        pngsData.push({
          title: title + ' Cutout PNG',
          slug: slug,
          description: faker.lorem.paragraph({ min: 2, max: 4 }),
          imageUrl: MOCK_PNG_DATA,
          thumbnailUrl: MOCK_PNG_DATA,
          category: currentCategory._id,
          tags: tags,
          downloads: faker.number.int({ min: 0, max: 5000 }),
          views: faker.number.int({ min: 100, max: 20000 }),
          featured: Math.random() > 0.9, // 10% chance to be featured
          approved: true,
          uploadedBy: adminUser._id,
        });
      }
    }

    // Insert PNGs in chunks of 500 to prevent BSON/Memory limits
    const CHUNK_SIZE = 500;
    for (let i = 0; i < pngsData.length; i += CHUNK_SIZE) {
      const chunk = pngsData.slice(i, i + CHUNK_SIZE);
      await Png.insertMany(chunk);
      console.log(`Inserted chunk of ${chunk.length} PNGs...`);
    }

    console.log(`Successfully seeded ${pngsData.length} total PNGs.`);
    console.log('Realistic massive seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
