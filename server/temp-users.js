import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if the 3 test users exist, if not create them.
    const testUsers = [
      { email: 'admin@pixelink.com', password: 'password123', role: 'admin' },
      { email: 'creator@pixelink.com', password: 'password123', role: 'creator' },
      { email: 'inspector@pixelink.com', password: 'password123', role: 'inspector' }
    ];

    for (const userData of testUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`Created ${userData.role}: ${userData.email}`);
      } else {
        // Enforce role
        existing.role = userData.role;
        existing.password = userData.password;
        await existing.save();
        console.log(`Updated ${userData.role}: ${userData.email} password to ${userData.password}`);
      }
    }
    
    console.log('RBAC user seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
