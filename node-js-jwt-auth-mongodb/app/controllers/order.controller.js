const nodemailer = require("nodemailer");


// Mock data for demonstration, replace with your order data fetching logic
const getOrderDetails = (orderId = "1234") => {
  return {
    id: orderId,
    items: [
      { name: "Burger", price: 5.99, quantity: 2 },
      { name: "Fries", price: 2.99, quantity: 1 }
    ],
    total: 14.97,
    date: new Date().toLocaleString(),
    userEmail: "chris.huang1575@gmail.com" // Replace with actual user email
  };
};

exports.sendReceipt = async (req, res) => {
  const { orderId } = req.body;
  const orderDetails = getOrderDetails(orderId); // Fetch order details by ID

  // Construct the receipt email content
  let emailContent = `<h3>Order Receipt - Order ID: ${orderDetails.id}</h3>`;
  emailContent += `<p>Date: ${orderDetails.date}</p>`;
  emailContent += "<ul>";
  orderDetails.items.forEach(item => {
    emailContent += `<li>${item.name} (x${item.quantity}): $${item.price}</li>`;
  });
  emailContent += "</ul>";
  emailContent += `<p>Total: $${orderDetails.total}</p>`;

  // Setup email transporter, similar to your existing setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "LuckyStrikesBowling2@gmail.com",
        pass: "zwxv udff cfqq iyyf",
      },
  });

  // Define email options
  const mailOptions = {
    from: "LuckyStrikesBowling2@gmail.com",
    to: orderDetails.userEmail,
    subject: "Your Food Order Receipt",
    html: emailContent
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: "Failed to send receipt" });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ message: "Receipt sent successfully" });
    }
  });
};
