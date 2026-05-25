import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const collections = await db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared ${collection.collectionName}`);
    }
    console.log("Database cleared successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
