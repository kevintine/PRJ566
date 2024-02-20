const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
    profilePicture: {
      type: String,
      default: "",
    },
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

module.exports = mongoose.model("User", UserSchema);
