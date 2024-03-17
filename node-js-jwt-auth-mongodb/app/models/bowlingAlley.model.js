const mongoose = require("mongoose");
const FrameSchema = require("./frame.model"); // Corrected import statement

/*const BowlingAlleySchema = new mongoose.Schema(
  {
    currentFrame: {
      type: FrameSchema, // Correctly using FrameSchema as an embedded document
      default: () => ({}), // Providing a default value as an empty object
    },
    currentPlayer: { type: String, default: null },
    totalFrames: { type: Number, default: 10 },
    gameOver: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalScore: { type: Number, default: 0 },
    frameScores: [Number],
    strikes: { type: Number, default: 0 },
    spares: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
  },
  { _id: false }
); // Review the need for _id based on your schema design*/

const BowlingAlleySchema = new mongoose.Schema({
  frames: [FrameSchema], // Array of Frame subdocuments
  currentPlayer: { type: String, default: null },
  totalFrames: { type: Number, default: 10 },
  gameOver: { type: Boolean, default: false },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Additional fields for score tracking
  totalScore: { type: Number, default: 0 },
  frameScores: [Number], // Array to store scores for individual frames
  // Additional fields for player statistics
  strikes: { type: Number, default: 0 },
  spares: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
});

const BowlingAlleyModel = mongoose.model("BowlingAlley", BowlingAlleySchema);
module.exports = BowlingAlleyModel;
