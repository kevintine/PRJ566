//server.js

const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const app = express();
const User = db.user;
const multer = require("multer");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const path = require("path");
const TempUser = require("./app/models/temUser.model");
const GameModel = require("./app/models/game.model");
const BowlingAlleyModel = require("./app/models/bowlingAlley.model");
const FrameModel = require("./app/models/frame.model");

const corsOptions = {
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to PRJ666 application." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.post("/api/send-email", async (req, res) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "LuckyStrikesBowling2@gmail.com",
      pass: "zwxv udff cfqq iyyf",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "LuckyStrikesBowling2@gmail.com",
    to: email,
    subject: "Password Reset",
    text: "Click the link below to reset your password:",
    html: `<p>Click the <a href="http://localhost:8081/resetpassword?email=${encodeURIComponent(
      email
    )}">link</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: "Email sent successfully" });
});

//Sprint3 - Ingeol Ko
//PRJ566-Sprint-2/node-js-jwt-auth-mongodb/server.js

const {
  Food,
  Drink,
} = require("../node-js-jwt-auth-mongodb/app/models/items.model");

const Order = require("../node-js-jwt-auth-mongodb/app/models/order.model")

app.post("/api/food", async (req, res) => {
  const { name, price, description, volume } = req.body;
  const food = new Food({ name, price, description, volume });
  try {
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error("Failed to add food:", err);
    res.status(500).json({ error: "Failed to add food" });
  }
});

app.get("/api/food", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error("Failed to get foods:", err);
    res.status(500).json({ error: "Failed to get foods" });
  }
});

app.post("/api/drink", async (req, res) => {
  const { name, price, description, volume } = req.body;
  const drink = new Drink({ name, price, description, volume });
  try {
    await drink.save();
    res.status(201).json(drink);
  } catch (err) {
    console.error("Failed to add drink:", err);
    res.status(500).json({ error: "Failed to add drink" });
  }
});

app.get("/api/drink", async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (err) {
    console.error("Failed to get drinks:", err);
    res.status(500).json({ error: "Failed to get drinks" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { items, totalAmount, taxAmount, totalAmountWithTax } = req.body;
  const order = new Order({ items, totalAmount, taxAmount, totalAmountWithTax });
  try {
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("Failed to add order:", err);
    res.status(500).json({ error: "Failed to add order" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
