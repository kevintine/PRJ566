// Sprint3 - Ingeol Ko
// PRJ566-MASTER/node-js-jwt-auth-mongodb/models/items.model.js

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
});

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
const Drink = mongoose.model("Drink", drinkSchema);

const foodItems = [
  { name: "Pizza", price: 20, description: "The Classic Pizza", volume: 100 },
  {
    name: "Fried Chicken",
    price: 25,
    description: "Special crispy chicken.",
    volume: 100,
  },
  {
    name: "Green Bowl",
    price: 13.5,
    description: "THealthy...and green...",
    volume: 100,
  },
  {
    name: "Hamburger",
    price: 15,
    description: "The Classic Burger",
    volume: 100,
  },
];

const drinkItems = [
  { name: "Coke", price: 2, description: "500ml", volume: 500 },
  { name: "Zero-Coke", price: 2, description: "500ml", volume: 500 },
  { name: "Sprite", price: 2, description: "500ml", volume: 500 },
  { name: "Orange Juice", price: 3, description: "500ml", volume: 500 },
];

Food.insertMany(foodItems)
  .then(() => {
    console.log("Food items saved successfully");
  })
  .catch((err) => {
    console.error("Failed to save food items:", err);
  });

Drink.insertMany(drinkItems)
  .then(() => {
    console.log("Drink items saved successfully");
  })
  .catch((err) => {
    console.error("Failed to save drink items:", err);
  });

module.exports = { Food, Drink };
