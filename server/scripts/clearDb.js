import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Png from '../models/Png.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pixelink');
    console.log('Connected to MongoDB to wipe data...');

    await Category.deleteMany();
    await Png.deleteMany();
    
    console.log('Successfully deleted all Categories and PNG images.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
};

clearDatabase();
