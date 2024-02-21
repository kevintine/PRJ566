const User = require("../models/user.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const fullName = req.body.fullName;
    const email = req.body.email;

    // Find the user by ID
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }
    console.log(fullName);

    // Update the user properties
    existingUser.fullName = fullName;

    // Check if email is provided before updating
    if (email) {
      existingUser.email = email;
    }
    console.log(existingUser.email);
    console.log(existingUser.fullName);

    // Save the changes to the database
    const updatedUser = await existingUser.save();

    console.log("Updated existingUser:", updatedUser);
    console.log("User updated successfully");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
