const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const passport = require("passport");
const jwt = require("jsonwebtoken");

const app = express();

// JSON parsing middleware
app.use(express.json());
// Initialize Passport.
app.use(passport.initialize());
// CORS configuration
app.use(cors());

// MongoDB 
mongoose.connect('mongodb+srv://kevintranr:0uX2rIo4Rcnfya84@cluster0.kgl6ubd.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
//////////////////////////////////////////////////////////////// Kevin Tran /////////////////////////////////////////////////////////////////
// Sending a password recovery email
app.post('/api/send-email', async (req, res) => {
    const { email } = req.body;
    // Configure nodemailer with your email service settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'LuckyStrikesBowling2@gmail.com',
        pass: 'zwxv udff cfqq iyyf',
        },
        tls: {
            // Add the following line to allow localhost as a valid URL
            rejectUnauthorized: false,
        },
    });

    // Define email options
    const mailOptions = {
        from: 'LuckyStrikesBowling2@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: 'Click the link below to reset your password:',
        html: `<p>Click the <a href="http://localhost:3000/resetpassword?email=${encodeURIComponent(email)}">link</a> to reset your password.</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully' });
});

// Add new user
app.post('/addUser', async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Delete user
app.delete('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Update user password by email
app.put('/update-password/:email', async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  try {
      const { email } = req.params;
      const { newPassword } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's password in the database
      const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { password: newPassword },
          { new: true } // Return the updated document
      );

      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

//////////////////////////////////////////////////////////// Ingeol Ko ///////////////////////////////////////////////////////////
// Sign-up API endpoint
app.post("/RegisterPage", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Sign-up API endpoint
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This email already exists." });
    }

    // Create a new user.
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Login API endpoint
app.post("/LoginPage", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// MyPage information retrieval API endpoint
app.get("/MyPage", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "your-secret-key");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User information update API endpoint
app.put("/MyPage", async (req, res) => {
  try {
    const { userId, username, email, newPassword } = req.body;

    // If the update is successful, respond with the updated user information.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, password: newPassword },
      { new: true } // To receive the information after the update, set { new: true }.
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user info" });
  }
});

// Route for email duplication check
app.post('/checkEmail', async (req, res) => {
  try {
    const { email } = req.body;

    // Duplicate email check in MongoDB
    const existingUser = await User.findOne({ email });

    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Error checking existing email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
