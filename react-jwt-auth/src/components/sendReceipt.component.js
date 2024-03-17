import React, { useState } from 'react';
import axios from 'axios';
const API_URL = "http://localhost:8080/api/order/";

function SendReceipt({ orderId }) {
  const [message, setMessage] = useState('');

  const handleSendReceipt = async () => {
    try {
      const response = await axios.post(API_URL+"send-receipt", { orderId });
      setMessage('Receipt sent successfully. Please check your email.');
    } catch (error) {
      setMessage('Error sending receipt. Please try again later.');
    }
  };

  return (
    <div>
      <button onClick={handleSendReceipt}>Send My Receipt</button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default SendReceipt;
