const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const app = express();
const User = db.user; // Add this line to import the User model
//const multer = require("multer");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const path = require("path");
const TempUser = require("./app/models/temUser.model");
const GameModel = require("./app/models/game.model");
const BowlingAlleyModel = require("./app/models/bowlingAlley.model");
const FrameModel = require("./app/models/frame.model");
const { EventEmitter } = require("events");
const { spawn } = require("child_process");

// Create an event emitter to manage SSE connections
const eventEmitter = new EventEmitter();

var corsOptions = {
  origin: "http://localhost:8081",
};

db.mongoose
  .connect(`mongodb+srv://kevintranr:0uX2rIo4Rcnfya84@cluster0.kgl6ubd.mongodb.net/`, {
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

// runs bowlingScript.py
app.post("/runBowlingScript", (req, res) => {
  const scriptPath = "./bowlingScript2.py"; // Update this path
  const pythonProcess = spawn("python", [scriptPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      res.send("Script executed successfully");
    } else {
      res.status(500).send("Script execution failed");
    }
  });
});

app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Fetch payment methods for a user
app.get("/user/payment-methods/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user.paymentMethods);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Add a new payment method
app.post("/user/payment-methods/:userId", async (req, res) => {
  try {
    const { cardholderName, cardNumber, expireMonth, expireYear, cvv, type } =
      req.body;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const newPaymentMethod = {
      cardholderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvv,
      type,
    };
    user.paymentMethods.push(newPaymentMethod);
    await user.save();
    res.send({ message: "Payment method added successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Delete a payment method
app.delete("/user/payment-methods/:userId/:cardNumber", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.paymentMethods = user.paymentMethods.filter(
      (method) => method.cardNumber !== req.params.cardNumber
    );
    await user.save();
    res.send({ message: "Payment method deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/api/test/verify-cvv", async (req, res) => {
  const { cardNumber, cvv } = req.body;
  try {
    // Simulating CVV check. Replace with actual logic.
    const user = await User.findOne({
      "paymentMethods.cardNumber": cardNumber,
      "paymentMethods.cvv": cvv,
    });
    if (user) {
      return res.send({ isValid: true });
    }
    res.send({ isValid: false });
  } catch (error) {
    console.error("CVV verification failed:", error);
    res.status(500).send({ message: "CVV verification failed" });
  }
});

app.post("/api/send-email-payment", async (req, res) => {
  const { email, orderDetails } = req.body;
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

  // Construct email message with order details
  const { items, totalAmount, taxAmount, totalAmountWithTax } = orderDetails;

  let orderDetailsHTML = `
  <table style="width:100%; border-collapse: collapse; border: 1px solid #ddd; font-family: Arial, sans-serif;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
        <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
      </tr>
    </thead>
    <tbody>
`;

  items.forEach((item) => {
    orderDetailsHTML += `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">$${item.price}</td>
    </tr>
  `;
  });

  orderDetailsHTML += `
    <tr style="background-color: #f2f2f2;">
      <td style="padding: 8px; border: 1px solid #ddd;"><b>Total Amount</b></td>
      <td style="padding: 8px; border: 1px solid #ddd;">$${totalAmount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><b>Tax Amount</b></td>
      <td style="padding: 8px; border: 1px solid #ddd;">$${taxAmount}</td>
    </tr>
    <tr style="background-color: #f2f2f2;">
      <td style="padding: 8px; border: 1px solid #ddd;"><b>Total Amount with Tax</b></td>
      <td style="padding: 8px; border: 1px solid #ddd;">$${totalAmountWithTax}</td>
    </tr>
  </tbody>
</table>
`;

  // Define email options
  const mailOptions = {
    from: "LuckyStrikesBowling2@gmail.com",
    to: email,
    subject: "Payment successful",
    text: "Your payment has been successful. Below are the order details:",
    html: `<p>Your payment has been successful. Below are the order details:</p>${orderDetailsHTML}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PRJ666 application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

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

// Define route to fetch all users
app.get("/all-users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users); // Send JSON response with users data
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define route to initialize a bowling game schema
app.post(
  "/create-new-game/:bowlingAlleyNumber/:numPlayers",
  async (req, res) => {
    try {
      // Extract the bowlingAlleyNumber from the URL parameters
      const { bowlingAlleyNumber } = req.params;
      const { numPlayers } = req.params;

      // Create a new game schema object
      const game = new GameModel({
        bowlingAlleyNumber: bowlingAlleyNumber,
        bowlingAlleys: [],
      });

      // Save the new game to the database
      await game.save();

      // Create and save bowling alleys based on the number of players
      for (let i = 0; i < numPlayers; i++) {
        const bowlingAlley = new BowlingAlleyModel({
          currentFrame: {}, // Initialize the current frame as needed
          currentPlayer: null, // Set the current player to null initially
          totalFrames: 10, // Set the total number of frames for the game
          gameOver: false, // Set the game over flag to false initially
          totalScore: 76, // Initialize total score to 0
          frameScores: [], // Initialize frame scores array
          strikes: 4, // Initialize strikes count
          spares: 1, // Initialize spares count
          gamesPlayed: 0, // Initialize games played count
        });

        // Save each new bowling alley to the database
        await bowlingAlley.save();

        // Push the bowling alley reference to the game schema object
        game.bowlingAlleys.push(bowlingAlley._id);
      }

      // Save the updated game with bowling alleys to the database
      await game.save();

      // Return a success response
      res.status(200).json({
        message: "New game initialized successfully",
        gameId: game._id,
      });
    } catch (error) {
      console.error("Error initializing game:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Define a route to add a frame to a specific bowling alley within a game
app.post(
  "/add-frame-to-bowling-alley/:bowlingAlleyNumber/:alleyIndex",
  async (req, res) => {
    try {
      const { bowlingAlleyNumber, alleyIndex } = req.params;
      const frameData = req.body; // JSON data for a new frame

      // Find the Game document by the bowlingAlleyNumber
      const game = await GameModel.findOne({ bowlingAlleyNumber }).populate(
        "bowlingAlleys"
      );

      // Ensure the game with the specified bowlingAlleyNumber exists
      if (!game) {
        return res.status(404).json({
          message: "Game not found for the specified bowlingAlleyNumber",
        });
      }

      // Ensure the requested alleyIndex is within the bounds of the bowlingAlleys array
      if (alleyIndex >= 0) {
        const bowlingAlley = game.bowlingAlleys[alleyIndex];

        // Create a new frame instance using the provided JSON data
        const newFrame = {
          roll1: frameData.roll1,
          roll2: frameData.roll2,
          score: frameData.score,
          isStrike: frameData.isStrike,
          isSpare: frameData.isSpare,
          pinsKnockedDown: frameData.pinsKnockedDown,
        };

        // Add the new frame to the frames array of the bowling alley
        bowlingAlley.frames.push(newFrame);

        // Save the changes to the Bowling Alley document
        await bowlingAlley.save();

        // Emit an SSE event to notify connected clients about the new frame
        eventEmitter.emit("newFrame", newFrame);

        await TempUser.updateMany(
          {
            /* criteria to identify associated temp users, e.g., bowlingAlleyNumber: bowlingAlleyNumber */
          },
          { $set: { game_id: game._id } }
        );

        res.status(200).json({
          message:
            "Frame added to the specified Bowling Alley within the game successfully",
          gameId: game._id,
        });
      } else {
        res
          .status(404)
          .json({ message: "Bowling Alley not found for the specified index" });
      }
    } catch (error) {
      console.error(
        "Error adding frame to the specified Bowling Alley within the game:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route for clients to connect and receive SSE updates for new frames
app.get("/sse", (req, res) => {
  console.log("route hit");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onNewFrame = (newFrame) => {
    res.write(`data: ${JSON.stringify(newFrame)}\n\n`);
  };

  // Add event listener for new frames
  eventEmitter.on("newFrame", onNewFrame);

  // Remove event listener when client disconnects
  req.on("close", () => {
    eventEmitter.off("newFrame", onNewFrame);
  });
});

// Define a route to delete the game and all bowling alleys contained in the game
app.delete("/delete-game/:gameId", async (req, res) => {
  try {
    // Extract the gameId from the URL parameters
    const { gameId } = req.params;

    // Find the game by its ID
    const game = await GameModel.findById(gameId);

    // Check if the game exists
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Loop through each bowling alley ID in the game and delete them
    for (const alleyId of game.bowlingAlleys) {
      await BowlingAlleyModel.findByIdAndDelete(alleyId);
    }

    // Delete the game itself
    await GameModel.findByIdAndDelete(gameId);

    // Return a success response
    res
      .status(200)
      .json({ message: "Game and all bowling alleys deleted successfully" });
  } catch (error) {
    console.error("Error deleting game and bowling alleys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/saveUserData/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the most recent game; assuming 'gameDate' is a field in your Game model
    const game = await GameModel.findOne().sort({ gameDate: -1 });
    if (!game) {
      return res.status(404).json({ message: "No games found." });
    }

    // Find a TempUser with a matching username
    const tempUser = await TempUser.findOne({ username: user.username });
    if (!tempUser) {
      return res.status(404).json({ message: "No matching TempUser found." });
    }

    // Assuming game.bowlingAlleys contains ObjectIds referencing BowlingAlley documents
    // And assuming TempUser has an index field that maps directly to a BowlingAlley index
    const bowlingAlley = await BowlingAlleyModel.findById(
      game.bowlingAlleys[tempUser.index]
    ).lean();

    if (!bowlingAlley) {
      return res
        .status(404)
        .json({ message: "Matching Bowling Alley not found." });
    }

    // Update User model with game_id and associated bowling alley
    // This example directly assigns the game and bowling alley, but you might need to adjust based on your schema
    user.previousGames = bowlingAlley; // Assuming you're tracking game history with an array of game IDs
    user.gameHistory.push(game);
    user.bowlingAlley.push(bowlingAlley); // Directly assign the Bowling Alley ID to the user

    await user.save();

    res.json({ message: "User data successfully updated.", user });
  } catch (error) {
    console.error("Failed to save user data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

////////////////////////////////// Ingeol //////////////////////////////////////////

// Sprint2 - Ingeol Ko
const router = express.Router();

app.post("/saveTempUserScores", async (req, res) => {
  try {
    const { users, num_players } = req.body;
    const usersWithPlayerCount = users.map((user, index) => ({
      ...user,
      num_players, // Add `num_players` to each user object
      index, // Add the current index of the user in the array, starting from 0
    }));

    const savedUsers = await TempUser.create(usersWithPlayerCount);
    res.status(201).json(savedUsers);
  } catch (err) {
    console.error("Failed to save temporary user scores:", err);
    res.status(500).json({ error: "Failed to save temporary user scores" });
  }
});

app.get("/api/temp-users/count", async (req, res) => {
  try {
    // Fetch a single document and retrieve only the num_players field
    const doc = await TempUser.findOne({}).select("num_players -_id"); // Adjust query as needed
    if (doc) {
      res.json({ count: doc.num_players });
    } else {
      res.status(404).json({ error: "No temp users found" });
    }
  } catch (err) {
    console.error("Failed to fetch num_players from temp users:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch num_players from temp users" });
  }
});

app.get("/tempUsers/:bowlingAlleyNumber", async (req, res) => {
  try {
    const bowlingAlleyNumber = req.params.bowlingAlleyNumber;
    const tempUsers = await TempUser.find({ bowlingAlleyNumber });
    res.status(200).json(tempUsers);
  } catch (err) {
    console.error("Failed to retrieve temporary users:", err);
    res.status(500).json({ error: "Failed to retrieve temporary users" });
  }
});

// Define a route to delete all users
app.delete("/removeTempUsers", async (req, res) => {
  try {
    console.log("inside removeTempUsers");
    // Delete all users from the database
    await TempUser.deleteMany({});
    await GameModel.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: "Failed to delete users" });
  }
});

////////////////////////////////// Ingeol //////////////////////////////////////////

// Generate and store random data for the bowling-related schemas
/*app.post("/api/generate-data", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware that adds the user to the request object

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and store random data for the bowling-related schemas
    const newFrame = new Frame({
      roll1: faker.random.number({ min: 0, max: 10 }),
      roll2: faker.random.number({ min: 0, max: 10 }),
      score: 0,
      isStrike: false,
      isSpare: false,
      pinsKnockedDown: 0,
    });

    const newBowlingAlley = new BowlingAlley({
      currentFrame: newFrame,
      currentPlayer: faker.name.findName(),
      totalFrames: 10,
      gameOver: false,
      user: userId,
    });

    const newGame = new Game({
      gameDate: faker.date.recent(),
      bowlingAlley: newBowlingAlley,
      user: userId,
    });

    // Update the user with the new bowling-related data
    user.bowlingAlley = newBowlingAlley;
    user.previousGames.push(newGame);

    // Save the changes to the user
    await user.save();

    res.json({ message: "Random data generated and linked to the user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/

//Sprint3 - Ingeol Ko
//PRJ566-Sprint-2/node-js-jwt-auth-mongodb/server.js

const {
  Food,
  Drink,
} = require("../node-js-jwt-auth-mongodb/app/models/items.model");

const Order = require("../node-js-jwt-auth-mongodb/app/models/order.model");

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
  const order = new Order({
    items,
    totalAmount,
    taxAmount,
    totalAmountWithTax,
  });
  try {
    await order.save();
    res.status(201).json({ orderId: order._id, ...order.toObject() });
  } catch (err) {
    console.error("Failed to add order:", err);
    res.status(500).json({ error: "Failed to add order" });
  }
});

// Assuming you're using Express.js
app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
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
      { password: bcrypt.hashSync(newPassword, 8) },
      { new: true } // Return the updated document
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for handling file uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});