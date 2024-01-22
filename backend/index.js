const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB 
mongoose.connect('mongodb+srv://kevintranr:0uX2rIo4Rcnfya84@cluster0.kgl6ubd.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/api/send-email', async (req, res) => {
    const { email } = req.body;
    // Configure nodemailer with your email service settings
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'LuckyStrikesBowling2@gmail.com',
        pass: 'zwxv udff cfqq iyyf',
        },
    });

    // Define email options
    const mailOptions = {
        from: 'LuckyStrikesBowling2@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: 'Click The Link To Reset',
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

// Update user password
app.put('/:userId/update-password', async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;
  
      // Update the user's password in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { password: newPassword },
        { new: true } // Return the updated document
      );
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
