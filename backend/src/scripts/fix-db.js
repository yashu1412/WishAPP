const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Drop the old clerkId index
    try {
      await User.collection.dropIndex("clerkId_1");
      console.log("Dropped clerkId index");
    } catch (error) {
      if (error.code === 27) {
        console.log("clerkId index doesn't exist");
      } else {
        throw error;
      }
    }

    console.log("Database fix complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixDatabase();
