const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    overlayConfig: {
      photoX: { type: Number, default: 0 },
      photoY: { type: Number, default: 0 },
      photoSize: { type: Number, default: 100 },
      textX: { type: Number, default: 0 },
      textY: { type: Number, default: 0 },
      fontSize: { type: Number, default: 24 },
      fontColor: { type: String, default: "#000000" },
      fontFamily: { type: String, default: "Arial" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
