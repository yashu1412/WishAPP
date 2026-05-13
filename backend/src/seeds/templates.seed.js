require("dotenv").config();
const mongoose = require("mongoose");
const Template = require("../models/Template");
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

const seedTemplates = async () => {
  await connectDB();
  try {
    const categories = await Category.find();
    
    if (categories.length === 0) {
      console.log("Please run categories seed first");
      process.exit(1);
    }

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    const templates = [
      {
        title: "Happy Birthday Blue",
        imageURL: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
        category: categoryMap["birthdays"],
        isPremium: false,
        overlayConfig: {
          photoX: 50, photoY: 50, photoSize: 200,
          textX: 100, textY: 300, fontSize: 32, fontColor: "#ffffff"
        }
      },
      {
        title: "Happy Birthday Pink",
        imageURL: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
        category: categoryMap["birthdays"],
        isPremium: true,
        overlayConfig: {
          photoX: 100, photoY: 80, photoSize: 180,
          textX: 120, textY: 350, fontSize: 28, fontColor: "#ff69b4"
        }
      },
      {
        title: "Happy Anniversary",
        imageURL: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop",
        category: categoryMap["anniversaries"],
        isPremium: false,
        overlayConfig: {
          photoX: 60, photoY: 60, photoSize: 220,
          textX: 90, textY: 320, fontSize: 30, fontColor: "#ffffff"
        }
      },
      {
        title: "Diwali Greetings",
        imageURL: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop",
        category: categoryMap["festivals"],
        isPremium: false,
        overlayConfig: {
          photoX: 70, photoY: 70, photoSize: 190,
          textX: 80, textY: 310, fontSize: 26, fontColor: "#ffd700"
        }
      },
      {
        title: "Wedding Blessings",
        imageURL: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        category: categoryMap["weddings"],
        isPremium: true,
        overlayConfig: {
          photoX: 55, photoY: 55, photoSize: 210,
          textX: 95, textY: 330, fontSize: 29, fontColor: "#ffffff"
        }
      },
      {
        title: "Happy New Year",
        imageURL: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop",
        category: categoryMap["new-year"],
        isPremium: false,
        overlayConfig: {
          photoX: 65, photoY: 65, photoSize: 200,
          textX: 100, textY: 340, fontSize: 34, fontColor: "#ff0000"
        }
      },
      {
        title: "Valentine's Day Red",
        imageURL: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=600&fit=crop",
        category: categoryMap["valentines-day"],
        isPremium: true,
        overlayConfig: {
          photoX: 80, photoY: 80, photoSize: 180,
          textX: 110, textY: 360, fontSize: 31, fontColor: "#dc143c"
        }
      },
      {
        title: "Golden Anniversary",
        imageURL: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
        category: categoryMap["anniversaries"],
        isPremium: true,
        overlayConfig: {
          photoX: 75, photoY: 75, photoSize: 195,
          textX: 105, textY: 325, fontSize: 27, fontColor: "#ffd700"
        }
      },
      {
        title: "Christmas Greetings",
        imageURL: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&h=600&fit=crop",
        category: categoryMap["festivals"],
        isPremium: false,
        overlayConfig: {
          photoX: 60, photoY: 60, photoSize: 205,
          textX: 90, textY: 315, fontSize: 28, fontColor: "#008000"
        }
      },
      {
        title: "Valentine's Day Pink",
        imageURL: "https://images.unsplash.com/photo-1516589178581-6cd7833ae128?w=800&h=600&fit=crop",
        category: categoryMap["valentines-day"],
        isPremium: false,
        overlayConfig: {
          photoX: 70, photoY: 70, photoSize: 190,
          textX: 100, textY: 340, fontSize: 30, fontColor: "#ff69b4"
        }
      }
    ];

    await Template.deleteMany();
    await Template.insertMany(templates);
    console.log("10 Templates seeded successfully across 6 categories");
  } catch (error) {
    console.error("Error seeding templates:", error);
  } finally {
    process.exit(0);
  }
};

seedTemplates();
