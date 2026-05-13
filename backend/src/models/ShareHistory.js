const mongoose = require("mongoose");

const shareHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional, incase guest users can share
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    platform: {
      type: String,
      enum: ["whatsapp", "facebook", "twitter", "download", "link"],
      required: true,
    },
    generatedImageURL: {
      type: String, // If we save the actual generated image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShareHistory", shareHistorySchema);
