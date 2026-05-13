require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding");
  } catch (error) {
    console.error("Connection failed", error);
    process.exit(1);
  }
};

const categories = [
  { name: "Birthdays", slug: "birthdays", description: "Birthday greetings", coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
  { name: "Anniversaries", slug: "anniversaries", description: "Anniversary wishes", coverImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop" },
  { name: "Festivals", slug: "festivals", description: "Festival greetings", coverImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop" },
  { name: "Weddings", slug: "weddings", description: "Wedding wishes", coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" },
  { name: "New Year", slug: "new-year", description: "New Year greetings", coverImage: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=300&fit=crop" },
  { name: "Valentine's Day", slug: "valentines-day", description: "Valentine's Day wishes", coverImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop" },
];

const seedCategories = async () => {
  await connectDB();
  try {
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log("6 Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    process.exit(0);
  }
};

seedCategories();
