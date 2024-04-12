import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";

const Payment = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({
    cardholderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvv: "",
    type: "", // Make sure to include 'type' to match your backend schema
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      const user = AuthService.getCurrentUser();
      if (!user) {
        navigate("/login");
      } else {
        try {
          const response = await UserService.getPaymentMethods(user.id);
          setCards(response.data);
        } catch (error) {
          console.error("Failed to fetch payment methods:", error);
        }
      }
    };
    fetchCards();
  }, [navigate]);

  const handleAddCard = async () => {
    const userId = AuthService.getCurrentUser().id;
    try {
      await UserService.addPaymentMethod(userId, newCard);
      const response = await UserService.getPaymentMethods(userId);
      setCards(response.data);
      setNewCard({
        cardholderName: "",
        cardNumber: "",
        expireMonth: "",
        expireYear: "",
        cvv: "",
        type: "",
      });
    } catch (error) {
      console.error("Failed to add the card:", error);
    }
  };

  const handleRemoveCard = async (cardId) => {
    const userId = AuthService.getCurrentUser().id;
    try {
      await UserService.removePaymentMethod(userId, cardId);
      const response = await UserService.getPaymentMethods(userId);
      setCards(response.data);
    } catch (error) {
      console.error("Failed to remove the card:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <MDBContainer
      className="py-5"
      fluid
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background3.webp)",
      }}
    >
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="5">
          <MDBCard className="rounded-3">
            <MDBCardBody className="p-4">
              <div className="text-center mb-4">
                <h3>Settings</h3>
                <h6>Payment</h6>
              </div>
              <p className="fw-bold mb-4 pb-2">Saved cards:</p>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="d-flex flex-row align-items-center mb-4 pb-1"
                >
                  <img
                    className="img-fluid"
                    src={`https://img.icons8.com/color/48/000000/${card.type.toLowerCase()}.png`}
                    alt={`${card.type} card`}
                  />
                  <div className="flex-fill mx-3">
                    <MDBInput
                      label="Card Number"
                      type="text"
                      size="lg"
                      value={`**** **** **** ${card.cardNumber.slice(-4)}`}
                      disabled
                    />
                  </div>
                  <a
                    href="#!"
                    onClick={() => handleRemoveCard(card.cardNumber)}
                  >
                    Remove card
                  </a>
                </div>
              ))}
              <p className="fw-bold mb-4">Add new card:</p>
              {/* Input fields for adding a new card are correctly linked to the state */}
              <MDBInput
                label="Cardholder's Name"
                type="text"
                size="lg"
                name="cardholderName"
                value={newCard.cardholderName}
                onChange={handleChange}
              />
              {/* Additional input fields for card details */}
              <MDBRow className="my-4">
                <MDBCol size="7">
                  <MDBInput
                    label="Card Number"
                    type="text"
                    size="lg"
                    name="cardNumber"
                    value={newCard.cardNumber}
                    onChange={handleChange}
                  />
                </MDBCol>
                <MDBCol size="2">
                  <MDBInput
                    label="Expire Month"
                    type="text"
                    size="lg"
                    name="expireMonth"
                    value={newCard.expireMonth}
                    onChange={handleChange}
                  />
                </MDBCol>
                <MDBCol size="3">
                  <MDBInput
                    label="Expire Year"
                    type="text"
                    size="lg"
                    name="expireYear"
                    value={newCard.expireYear}
                    onChange={handleChange}
                  />
                </MDBCol>
                <MDBCol size="2">
                  <MDBInput
                    label="CVV"
                    type="password"
                    size="lg"
                    name="cvv"
                    value={newCard.cvv}
                    onChange={handleChange}
                  />
                </MDBCol>
                <MDBCol size="12">
                  <MDBInput
                    label="Card Type"
                    type="text"
                    size="lg"
                    name="type"
                    value={newCard.type}
                    onChange={handleChange}
                  />
                </MDBCol>
              </MDBRow>
              <MDBBtn color="success" size="lg" block onClick={handleAddCard}>
                Add card
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Payment;
