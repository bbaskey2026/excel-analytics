import mongoose from "mongoose";
//connectio function of mongodb Cloud cluster
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
