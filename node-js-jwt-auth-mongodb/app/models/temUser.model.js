const mongoose = require("mongoose");

const TempUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bowlingAlleyNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
