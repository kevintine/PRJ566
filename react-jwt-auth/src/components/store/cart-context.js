//Sprint -Ingeol Ko

// CartContext.js
import React from "react";
const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearall: () => {},
});

export default CartContext;