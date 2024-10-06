const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"], // Only allow these values for priority
    required: true,
    default: "low", // Optional: set a default priority if not provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", FileSchema);
