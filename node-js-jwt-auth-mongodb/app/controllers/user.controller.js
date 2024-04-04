const User = require("../models/user.model");
const multer = require("multer");
const Game = require("../models/game.model");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename to avoid collisions
  },
});

const upload = multer({ storage: storage }).single("profilePicture");

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

exports.upload = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Multer error: " + err.message });
      } else if (err) {
        return res.status(500).json({
          error: "An error occurred during file upload: " + err.message,
        });
      }

      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      const userId = req.userId; // Assuming userId is provided in the request

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found.");
      }

      const filePath = `/uploads/${req.file.filename}`; // Path to the uploaded file

      user.profilePicture = filePath;
      await user.save();

      // Send a response indicating success
      res.status(200).json({
        message: "Profile pic uploaded successfully.",
        profilePicturePath: filePath, // Include the file path in the response
      });
    } catch (error) {
      console.error("Error uploading profile pic:", error);
      res.status(500).send("An error occurred during profile pic upload.");
    }
  });
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

exports.history = async (req, res) => {
  const userId = req.params.userId; // Extracted from JWT token in middleware

  try {
    // Find the user and select only the gameHistory field
    const userWithGames = await User.findById(userId)
      .select("gameHistory")
      .populate("gameHistory");
    if (!userWithGames) {
      return res.status(404).send({ message: "User not found." });
    }

    // Respond with the game history
    res.status(200).json(userWithGames.gameHistory);
  } catch (error) {
    console.error("Error retrieving game history:", error);
    res.status(500).send({ message: "Internal server error." });
  }
};
