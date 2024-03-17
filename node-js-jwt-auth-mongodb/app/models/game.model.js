const mongoose = require("mongoose");
//const FrameSchema = require("./frame.model");

const GameSchema = new mongoose.Schema({
  // bowlingAlleys: [BowlingAlleySchema],
  bowlingAlleys: [
    { type: mongoose.Schema.Types.ObjectId, ref: "BowlingAlley" },
  ], // Array of Frame subdocuments
  bowlingAlleyNumber: { type: Number, default: 0 },
  gameDate: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const GameModel = mongoose.model("Game", GameSchema);
module.exports = GameModel;
