import Header from "./Layout/Header";
import Meals from "./Meals/Meals";
import Cart from ".//Cart/Cart";
import CartProvider from "./store/CartProvider";
import React, { useState } from 'react';

function Orders() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  return (
    <CartProvider>
      {cartIsShown && <Cart onClose={hideCartHandler} />}

      <Header onShowCart={showCartHandler} onClose={hideCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default Orders;