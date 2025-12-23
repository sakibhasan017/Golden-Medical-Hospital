import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "medical_hospital",  
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB connection error", error);
  }
};
