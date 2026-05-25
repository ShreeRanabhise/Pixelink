import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pixelink')
  .then(async () => {
    const db = mongoose.connection.db;
    const settings = await db.collection('settings').findOne({});
    console.log("Settings in DB:", settings);
    process.exit(0);
  })
  .catch(console.error);
