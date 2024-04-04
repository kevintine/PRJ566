//Cart.js
import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import axios from "axios";

import CartContext from "../store/cart-context";
import OrderDelivered from "./OrderDelivered";
import { useNavigate } from "react-router-dom";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const navigate = useNavigate();
  const [showOrder, setShowOrder] = useState(false);

  const taxRate = 0.13;
  const taxAmount = `$${(cartCtx.totalAmount * taxRate).toFixed(2)}`;
  const totalAmountWithTax = `$${(cartCtx.totalAmount * (1 + taxRate)).toFixed(
    2
  )}`;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    const orderData = {
      items: cartCtx.items,
      totalAmount: cartCtx.totalAmount,
      taxAmount: cartCtx.totalAmount * taxRate,
      totalAmountWithTax: cartCtx.totalAmount * (1 + taxRate),
    };

    axios
      .post("http://localhost:8080/api/orders", orderData)
      .then((response) => {
        console.log("Order placed successfully:", response.data);
        const orderId = response.data.orderId; // Get the orderId from the response
        console.log("Order placed successfully with orderId:", orderId);
        cartCtx.clearall();
        setShowOrder(true);
        navigate(`/checkout?orderId=${orderId}`);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
    navigate("/checkout");
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {!showOrder ? (
        <>
          {cartItems}
          <div className={classes.total}>
            <span>Amount</span>
            <span>{cartCtx.totalAmount.toFixed(2)}</span>
          </div>
          <div className={classes.total}>
            <span>Tax (13%)</span>
            <span>{taxAmount}</span>
          </div>
          <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmountWithTax}</span>
          </div>
          <div className={classes.actions}>
            <button className={classes["button--alt"]} onClick={props.onClose}>
              Close
            </button>
            {cartCtx.items.length > 0 && (
              <button className={classes.button} onClick={orderHandler}>
                Order
              </button>
            )}
          </div>
        </>
      ) : (
        <OrderDelivered onClose={props.onClose} />
      )}
    </Modal>
  );
};

export default Cart;
