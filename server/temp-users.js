import mongoose from 'mongoose';
import User from './models/User.js';

const checkUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/png-marketplace');
    const users = await User.find({});
    console.log('USERS IN DB:', users.map(u => ({ email: u.email, role: u.role })));

    if (users.length > 0) {
      // Just force the password of the first admin to 'admin12345'
      const admin = users.find(u => u.role === 'admin') || users[0];
      admin.password = 'admin12345';
      await admin.save();
      console.log('Password reset to admin12345 for', admin.email);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
