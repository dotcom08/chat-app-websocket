import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log("Error while connecting to DB", error.message);
    process.exit(1);
  }
}
