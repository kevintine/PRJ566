//Sprint3- Ingeol Ko

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      name: String,
      amount: Number,
      price: {
        type: Number,
        get: (value) => value.toFixed(2),
        set: (value) => parseFloat(value.toFixed(2)),
      },
    },
  ],
  totalAmount: {
    type: Number,
    get: (value) => value.toFixed(2),
    set: (value) => parseFloat(value.toFixed(2)),
  },
  taxAmount: {
    type: Number,
    get: (value) => value.toFixed(2),
    set: (value) => parseFloat(value.toFixed(2)),
  },
  totalAmountWithTax: {
    type: Number,
    get: (value) => value.toFixed(2),
    set: (value) => parseFloat(value.toFixed(2)),
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
