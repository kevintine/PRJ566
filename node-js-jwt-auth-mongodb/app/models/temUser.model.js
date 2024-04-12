const mongoose = require("mongoose");

const TempUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
    },
    bowlingAlleyNumber: {
      type: Number,
      required: true,
    },
    num_players: {
      type: Number,
      required: false,
    },
    game_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
  },
  { timestamps: true }
);

const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
