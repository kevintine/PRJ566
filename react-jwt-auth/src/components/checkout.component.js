import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRadio,
  MDBRow,
} from "mdb-react-ui-kit";

const Checkout = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [order, setOrder] = useState(null);
  //const [giftCardCouponCode, setGiftCardCouponCode] = useState("");
  const [isGiftCardCouponVisible, setIsGiftCardCouponVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCards = async () => {
      const user = AuthService.getCurrentUser();
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const response = await UserService.getPaymentMethods(user.id);
        setCards(response.data);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };
    fetchCards();
  }, [navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = new URLSearchParams(location.search).get("orderId");
      if (!orderId) {
        // Handle case when orderId is not provided
        return;
      }
      try {
        const response = await UserService.getOrderDetails(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        // Handle error fetching order details
      }
    };
    fetchOrderDetails();
  }, [location.search]);

  const handleCardSelectionChange = (e) => {
    setSelectedCardId(e.target.value);
    console.log(`New selected card ID is ${e.target.value}`);
    setIsPaymentEnabled(false); // Disable the payment button until CVV is verified
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value);
    console.log(`CVV changed to ${e.target.value}`);
  };

  const handleVerifyCvv = async () => {
    try {
      const response = await UserService.verifyCardCvv(selectedCardId, cvv);
      const isValid = response.data.isValid;
      console.log(isValid);
      setIsPaymentEnabled(isValid);
      if (!isValid) {
        alert("Invalid CVV. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setIsPaymentEnabled(false);
    }
  };

  const handleAddPaymentCard = () => {
    navigate("/payment");
  };

  const handleProceedToPayment = async () => {
    console.log("Processing payment for card ID:", selectedCardId);

    // Placeholder for your actual payment processing logic
    const paymentSuccess = true; // Simulate a successful payment

    if (paymentSuccess) {
      const userEmail = AuthService.getCurrentUser().email; // Substitute with the actual email of the user

      try {
        // Prepare the order details to send to the backend
        const orderDetails = {
          orderId: order.id,
          items: order.items,
          totalAmount: order.totalAmount,
          taxAmount: order.taxAmount,
          totalAmountWithTax: order.totalAmountWithTax,
        };

        // Call the API endpoint for sending the payment confirmation email and order details
        const response = await fetch(
          "http://localhost:8080/api/send-email-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail, orderDetails }),
          }
        );

        if (response.ok) {
          console.log("Payment confirmation email sent.");
          alert("Payment successful and confirmation email sent.");
        } else {
          throw new Error("Failed to send confirmation email.");
        }
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        alert(
          "Payment successful, but there was an issue sending the confirmation email."
        );
      }
    } else {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <MDBContainer fluid className="p-5" style={{ backgroundColor: "#eee" }}>
      <MDBCard className="checkout-card">
        <MDBCardBody className="checkout-card-body">
          <MDBRow className="d-flex justify-content-center pb-5">
            <MDBCol md="7" xl="5" className="mb-4 mb-md-0">
              <div className="py-4 d-flex flex-row">
                <h5>
                  <span className="far fa-check-square pe-2"></span>
                  <b>BowlingAlley-Checkout</b> |
                </h5>
                <span className="ps-2">Pay</span>
              </div>
              {order && (
                <>
                  <h4 className="text-success">${order.totalAmount}</h4>
                  <h4>Food &amp; Supplies</h4>
                  <div className="d-flex pt-2">
                    <div>
                      <p>
                        <b>
                          Coupone or Gift card{" "}
                          <span className="text-success">$0.00</span>
                        </b>
                      </p>
                    </div>
                    <div className="ms-auto">
                      <p className="text-primary">
                        <MDBBtn
                          color="link"
                          className="text-primary"
                          onClick={() =>
                            setIsGiftCardCouponVisible(!isGiftCardCouponVisible)
                          }
                        >
                          Add Gift Card/Coupon
                        </MDBBtn>
                      </p>
                    </div>
                  </div>
                  <p>
                    To utilize the gift card or coupon option, please provide
                    the necessary code in the field below.
                  </p>
                  <div
                    className="rounded d-flex"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div className="p-2">Purchace a gift card</div>
                    <div className="ms-auto p-2">
                      <MDBBtn color="link" onClick>
                        Gift Card
                      </MDBBtn>
                    </div>
                  </div>
                  <hr />
                  <div className="pt-2">
                    <div className="d-flex pb-2">
                      <div>
                        <p>
                          <b>
                            Balance <span className="text-success"></span>
                          </b>
                        </p>
                      </div>
                      <div className="ms-auto">
                        <p className="text-primary">
                          <MDBBtn color="link" onClick={handleAddPaymentCard}>
                            Add payment card
                          </MDBBtn>
                        </p>
                      </div>
                    </div>
                    <p>
                      This is an estimate for the portion of your order (not
                      covered by insurance) due today . once gift card finalizes
                      their review refunds and/or balances will reconcile
                      automatically.
                    </p>
                    {cards.map((card, index) => (
                      <div
                        key={card.cardNumber}
                        className="d-flex flex-row pb-3"
                      >
                        <MDBRadio
                          name="cardSelection"
                          id={`card-${card.cardNumber}`}
                          value={card.cardNumber}
                          checked={selectedCardId === card.cardNumber}
                          onChange={handleCardSelectionChange}
                          inline
                        />
                        <label
                          htmlFor={`card-${card.cardNumber}`}
                          className="pe-2"
                        >
                          {card.cardholderName}
                        </label>
                        <MDBIcon
                          fab
                          icon={`cc-${card.type.toLowerCase()}`}
                          size="lg"
                          className="me-2"
                        />
                        <span>**** **** **** {card.cardNumber.slice(-4)}</span>
                      </div>
                    ))}

                    <MDBInput
                      label="Enter CVV to verify"
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                    />
                    <MDBBtn
                      size="lg"
                      disabled={!selectedCardId || !cvv.trim()}
                      onClick={handleVerifyCvv}
                    >
                      Verify CVV
                    </MDBBtn>

                    <MDBBtn
                      color="success"
                      block
                      size="lg"
                      disabled={!isPaymentEnabled}
                      onClick={handleProceedToPayment}
                    >
                      Proceed to Payment
                    </MDBBtn>
                  </div>
                </>
              )}
            </MDBCol>
            <MDBCol md="5" xl="4" offsetxl="1">
              {order && (
                <div
                  className="rounded d-flex flex-column p-2"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="p-2 me-3">
                    <h4>Order Recap</h4>
                  </div>
                  {order.items.map((item, index) => (
                    <div key={index} className="p-2 d-flex">
                      <MDBCol size="8">{item.name}</MDBCol>
                      <div className="ms-auto">${item.price}</div>
                    </div>
                  ))}
                  <div className="border-top px-2 mx-2"></div>
                  <div className="p-2 d-flex pt-3">
                    <MDBCol size="8">Total Amount</MDBCol>
                    <div className="ms-auto">${order.totalAmount}</div>
                  </div>
                  <div className="p-2 d-flex">
                    <MDBCol size="8">Tax Amount</MDBCol>
                    <div className="ms-auto">${order.taxAmount}</div>
                  </div>
                  <div className="p-2 d-flex">
                    <MDBCol size="8">Total Amount with Tax</MDBCol>
                    <div className="ms-auto">${order.totalAmountWithTax}</div>
                  </div>
                </div>
              )}
              <div className="py-4 d-flex justify-content-end">
                <h6>
                  <a href="#!" onClick={() => navigate("/")}>
                    Cancel and return
                  </a>
                </h6>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Checkout;
