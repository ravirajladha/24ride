import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';

dotenv.config();
console.log("Connecting to MongoDB:", process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}`);

    // Seed default admin user
    await seedAdminData();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

// Function to seed the default admin user if not exists
const seedAdminData = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });

    if (!existingAdmin) {
      await Admin.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin', // Password will be hashed automatically before saving
      });
      console.log('✅ Default Admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error("❌ Error while seeding admin user:", error);
  }
};

export default connectDB;
