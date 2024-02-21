//Sprint2 - Ingeol Ko
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const TempUserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const TempUser = mongoose.model("TempUser", TempUserSchema);
  
  module.exports = TempUser;
  //Sprint2 - Ingeol Ko