const mongoose = require("mongoose");

// Define FrameSchema for embedding within other schemas
const FrameSchema = new mongoose.Schema(
  {
    roll1: { type: Number, default: 0 },
    roll2: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    isStrike: { type: Boolean, default: false },
    isSpare: { type: Boolean, default: false },
    pinsKnockedDown: { type: Number, default: 0 },
  },
  { _id: false }
); // Keeping _id: false for embedded documents

// Export the schema instead of the model
module.exports = FrameSchema;
