import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Png from '../models/Png.js';

dotenv.config();

// Tiny transparent 1x1 and small custom vector base64 PNG data to ensure immediate rendering
const MOCK_PNG_DATA = {
  iphone: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkXmU6LuwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAd0lEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBlMIAAE3h1d0AAAAAElFTkSuQmCC',
  burger: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkY6pI1rAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAhUlEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBrbGAAG2XjSFAAAAAElFTkSuQmCC',
  dog: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkZcZ0nlgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAhUlEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBrbGAAG2XjSFAAAAAElFTkSuQmCC',
  leaf: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkaXy6qiwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAhUlEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBrbGAAG2XjSFAAAAAElFTkSuQmCC'
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pixelink');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Png.deleteMany();
    console.log('Database cleared.');

    // 1. Create Admin
    const adminUser = await User.create({
      email: 'admin@pixelink.com',
      password: 'admin12345',
      role: 'admin',
    });
    console.log('Admin user created successfully: admin@pixelink.com / admin12345');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Computers, smartphones, hardware parts, and futuristic gadgets.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Food & Drinks',
        slug: 'food-drinks',
        description: 'Yummy burgers, fresh juices, fruits, vegetables, and hot coffee.',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Animals',
        slug: 'animals',
        description: 'Domestic pets, wildlife beasts, birds, fish, and insects.',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Nature',
        slug: 'nature',
        description: 'Green leaves, blooming flowers, forest trees, mountains, and weather icons.',
        image: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?w=500&auto=format&fit=crop&q=60',
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log('Categories seeded:', seededCategories.length);

    // Map seeded category IDs
    const catMap = seededCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {});

    // 3. Create Sample PNGs
    const pngsData = [
      {
        title: 'iPhone 15 Pro Transparent Space Gray',
        slug: 'iphone-15-pro-transparent-space-gray',
        description: 'Clean cut-out model of the latest smartphone, perfect for premium UI/UX design mockups.',
        imageUrl: MOCK_PNG_DATA.iphone,
        thumbnailUrl: MOCK_PNG_DATA.iphone,
        category: catMap['technology'],
        tags: ['iphone', 'phone', 'smartphone', 'tech', 'gadget', 'apple', 'mockup'],
        downloads: 145,
        views: 890,
        featured: true,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'MacBook Pro Front View Mockup',
        slug: 'macbook-pro-front-view-mockup',
        description: 'Isometric Macbook transparent PNG for dashboard design previews and desktop layouts.',
        imageUrl: MOCK_PNG_DATA.iphone,
        thumbnailUrl: MOCK_PNG_DATA.iphone,
        category: catMap['technology'],
        tags: ['macbook', 'laptop', 'computer', 'apple', 'tech', 'device'],
        downloads: 88,
        views: 420,
        featured: false,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Juicy Cheeseburger with Cheese Overlay',
        slug: 'juicy-cheeseburger-with-cheese-overlay',
        description: 'Delicious fast food hamburger model featuring melting cheese and fresh salad toppings.',
        imageUrl: MOCK_PNG_DATA.burger,
        thumbnailUrl: MOCK_PNG_DATA.burger,
        category: catMap['food-drinks'],
        tags: ['burger', 'food', 'hamburger', 'junk food', 'beef', 'delicious', 'lunch'],
        downloads: 320,
        views: 1430,
        featured: true,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Organic Green Apple Slice',
        slug: 'organic-green-apple-slice',
        description: 'Fresh sliced healthy green apple, clean background, perfect for culinary artwork designs.',
        imageUrl: MOCK_PNG_DATA.burger,
        thumbnailUrl: MOCK_PNG_DATA.burger,
        category: catMap['food-drinks'],
        tags: ['apple', 'fruit', 'food', 'green apple', 'healthy', 'slice'],
        downloads: 65,
        views: 290,
        featured: false,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Golden Retriever Sitting Portrait',
        slug: 'golden-retriever-sitting-portrait',
        description: 'Adorable golden retriever puppy sitting down. Beautiful crisp transparent PNGs.',
        imageUrl: MOCK_PNG_DATA.dog,
        thumbnailUrl: MOCK_PNG_DATA.dog,
        category: catMap['animals'],
        tags: ['dog', 'retriever', 'puppy', 'pet', 'animal', 'golden retriever', 'cute'],
        downloads: 512,
        views: 2310,
        featured: true,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Cute Fluffy White Cat Peeking',
        slug: 'cute-fluffy-white-cat-peeking',
        description: 'Playful domestic kitty looking over an edge. Ideal for banners and funny meme templates.',
        imageUrl: MOCK_PNG_DATA.dog,
        thumbnailUrl: MOCK_PNG_DATA.dog,
        category: catMap['animals'],
        tags: ['cat', 'kitten', 'pet', 'animal', 'white cat', 'fluffy', 'cute'],
        downloads: 290,
        views: 1100,
        featured: false,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Tropical Monstera Green Leaf',
        slug: 'tropical-monstera-green-leaf',
        description: 'Detailed green monstera leaf PNGs. Perfect for jungle aesthetic prints and organic web assets.',
        imageUrl: MOCK_PNG_DATA.leaf,
        thumbnailUrl: MOCK_PNG_DATA.leaf,
        category: catMap['nature'],
        tags: ['leaf', 'nature', 'monstera', 'plant', 'green', 'tropical', 'jungle'],
        downloads: 410,
        views: 1890,
        featured: true,
        approved: true,
        uploadedBy: adminUser._id,
      },
      {
        title: 'Pink Sakura Cherry Blossom Branch',
        slug: 'pink-sakura-cherry-blossom-branch',
        description: 'Elegant blooming Japanese cherry blossom twigs. Clean vector style transparent alpha mask.',
        imageUrl: MOCK_PNG_DATA.leaf,
        thumbnailUrl: MOCK_PNG_DATA.leaf,
        category: catMap['nature'],
        tags: ['sakura', 'cherry blossom', 'flower', 'blossom', 'pink', 'spring', 'nature'],
        downloads: 130,
        views: 650,
        featured: false,
        approved: true,
        uploadedBy: adminUser._id,
      },
    ];

    const seededPngs = await Png.insertMany(pngsData);
    console.log('PNGs seeded:', seededPngs.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
