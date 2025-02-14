import mongoose from "mongoose";

// Function to connect to the MongoDB database
export const connectDb = async () => {
  try {
    // Ensure the DB URL is available in the environment variables
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in the environment variables.");
    }

    // Connect to the database (without deprecated options)
    await mongoose.connect(mongoUri);

    console.log("Database connected successfully.");
  } catch (error) {
    // Log the error and exit the process
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the application with a failure code
  }
};
