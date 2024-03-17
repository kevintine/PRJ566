<<<<<<< HEAD
/*const mongoose = require("mongoose");
=======
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    fullName: { type: String, default: "" },
<<<<<<< HEAD
    profilePicture: { type: String, default: "" },
    bowlingAlley: { type: BowlingAlley.schema, default: {} },
    previousGames: [Game.schema],
    gameHistory: [Game.schema],
=======
    profilePicture: {
      type: String,
      default: "",
    },
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("profilePicturePath").get(function () {
  if (this.profilePicture) {
    return `/uploads/${this.profilePicture}`;
  }
  return "";
});

<<<<<<< HEAD
module.exports = mongoose.model("User", UserSchema);*/

//===============Sprint 2=================

const mongoose = require("mongoose");
const GameSchema = require("./game.model").schema; // Import GameSchema for embedding

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    fullName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    bowlingAlley: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BowlingAlley",
    },
    previousGames: [GameSchema],
    gameHistory: [GameSchema],
    preferredLane: { type: String, default: "" },
    preferredBall: { type: String, default: "" },
    preferredShoeSize: { type: String, default: "" },
    paymentMethods: [{ type: String }],
    paymentHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("profilePicturePath").get(function () {
  if (this.profilePicture) {
    return `${this.profilePicture}`;
  }
  return "";
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
=======
module.exports = mongoose.model("User", UserSchema);
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
