const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const app = express();
const User = db.user; // Add this line to import the User model
const multer = require("multer");
const nodemailer = require("nodemailer");
var corsOptions = {
  origin: "http://localhost:8081",
};

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        new Role({
          name: "user",
        })
          .save()
          .then(() => {
            console.log("added 'user' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });

        new Role({
          name: "moderator",
        })
          .save()
          .then(() => {
            console.log("added 'moderator' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });

        new Role({
          name: "admin",
        })
          .save()
          .then(() => {
            console.log("added 'admin' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
}
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // You need to create an 'uploads' directory in your project
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PRJ666 application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

/*app.put("/api/auth/update", upload.single("profilePicture"), (req, res) => {
  console.log("Received update request:", req.body);
  if (!req.user || !req.user.id) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  User.findByIdAndUpdate(req.user.id, {
    $set: {
      fullName: req.body.fullName,
      email: req.body.email,
      profilePicture: req.file ? req.file.filename : undefined,
    },
  })
    .then(() => {
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch((err) => {
      console.error("Failed to update user:", err);
      res.status(500).json({ message: "Failed to update user" });
    });
});*/

//////////////////////////////////////////////////////////////// Kevin Tran /////////////////////////////////////////////////////////////////
// Sending a password recovery email
app.post("/api/send-email", async (req, res) => {
  const { email } = req.body;
  // Configure nodemailer with your email service settings
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "LuckyStrikesBowling2@gmail.com",
      pass: "zwxv udff cfqq iyyf",
    },
    tls: {
      // Add the following line to allow localhost as a valid URL
      rejectUnauthorized: false,
    },
  });

  // Define email options
  const mailOptions = {
    from: "LuckyStrikesBowling2@gmail.com",
    to: email,
    subject: "Password Reset",
    text: "Click the link below to reset your password:",
    html: `<p>Click the <a href="http://localhost:8081/resetpassword?email=${encodeURIComponent(
      email
    )}">link</a> to reset your password.</p>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);

  res.json({ message: "Email sent successfully" });
});

// Update user password by email
app.put("/update-password/:email", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  try {
    const { email } = req.params;
    const { newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
