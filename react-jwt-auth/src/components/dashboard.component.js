import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Container, Row, Col, Button, Image, Table } from "react-bootstrap";
import "./dashboard.css";

import { Modal } from "react-bootstrap";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    profilePicture: "",
  });
  const [redirect, setRedirect] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [userNames, setUserNames] = useState(Array(1).fill(""));

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        setRedirect("/login");
      } else {
        setCurrentUser(currentUser);
        // Fetch game history if it's not part of currentUser object
        try {
          const historyResponse = await AuthService.history(currentUser.id);
          if (historyResponse && Array.isArray(historyResponse.data)) {
            const lastGame =
              historyResponse.data[historyResponse.data.length - 1];
            setCurrentUser({ ...currentUser, lastGame }); // Add lastGame to currentUser state
          } else {
            console.error("Game history data is undefined or not an array");
          } // Add lastGame to currentUser state
        } catch (error) {
          console.error("Failed to fetch game history:", error);
        }
      }
      setLoading(false);
    };

    fetchGameData();
  }, []);

  const startGame = () => {
    console.log("Starting new game...");

    // Set the state to show the modal
    setShowModal(true);
  };

  const handleUserNameChange = (index, value) => {
    const newNames = [...userNames];
    newNames[index] = value;
    setUserNames(newNames);
  };

  const handleSelectUser = (event) => {
    setNumberOfUsers(parseInt(event.target.value)); // Parse the value to integer
  };

  const goToAnalytics = () => {
    console.log("Navigating to analytics page...");
    // Navigate to analytics page
  };

  const redirectToHistory = () => {
    setRedirect("/history");
  };

  const editUserInfo = () => {
    setRedirect("/profile");
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="dashboard-container">
      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Start New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="userNumber">Select Number of Players:</label>
          <select
            id="userNumber"
            value={numberOfUsers}
            onChange={handleSelectUser}
          >
            {[...Array(6).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
          {[...Array(numberOfUsers)].map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1}`}
              value={userNames[index] || ""}
              onChange={(e) => handleUserNameChange(index, e.target.value)}
            />
          ))}
        </Modal.Body>

        <Modal.Footer>
          {/* Button to close the modal */}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {/* Button to start the game */}
          <Button
            variant="primary"
            onClick={() => {
              // Perform actions to start the game
              setShowModal(false);
            }}
          >
            Start Game
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="user-profile-section mt-4 mb-4">
        <Col xs={12} md={4} className="mb-3 profile-col">
          <Image
            src={
              currentUser.profilePicture // this is comming from local storage after loging out it will be removed, need to correct so that it will take the pic from database
                ? `http://localhost:8080${currentUser.profilePicture}` // Ensure correct port and prepend domain if necessary
                : "default-profile.png" // Path to a default image if no profile picture is set
            }
            alt="Profile"
            roundedCircle
            className="profile-picture"
          />
        </Col>
        <Col xs={12} md={8} className="mb-3">
          <h1 className="username">{currentUser.fullName}</h1>
          <p>Email: {currentUser.email}</p>
          <div className="user-actions">
            <Button
              variant="primary"
              onClick={startGame}
              className="action-btn"
            >
              Start Game
            </Button>
            <Button
              variant="info"
              onClick={goToAnalytics}
              className="action-btn"
            >
              Analytics
            </Button>
            <Button
              variant="secondary"
              onClick={editUserInfo}
              className="action-btn"
            >
              Edit User Info
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="user-details-container">
        <Col>
          <h4>Last Game Played</h4>
          {/* Table UI for displaying the last game's scores */}
          <Table bordered className="bowling-table">
            <thead>
              <tr>
                {[...Array(10).keys()].map((frame) => (
                  <th
                    key={`header-frame-${frame}`}
                    className="text-center"
                    style={{
                      backgroundColor: "darkgreen",
                      color: "lightgreen",
                      border: "1px solid black",
                    }}
                  >
                    {frame + 1}
                  </th>
                ))}
                <th
                  className="text-center"
                  style={{
                    backgroundColor: "darkgreen",
                    color: "lightgreen",
                    border: "1px solid black",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {currentUser.lastGame && currentUser.lastGame.frames.length > 0
                  ? currentUser.lastGame.frames.map((frame, index) => (
                      <td
                        key={`score-frame-${index}`}
                        className="text-center"
                        style={{
                          backgroundColor: "darkred",
                          color: "orange",
                          border: "1px solid black",
                        }}
                      >
                        {frame.isStrike
                          ? "X"
                          : frame.isSpare
                          ? "/"
                          : `${frame.roll1}, ${frame.roll2}`}
                      </td>
                    ))
                  : // If no frames data is present, display placeholders
                    [...Array(10).keys()].map((index) => (
                      <td
                        key={`empty-frame-${index}`}
                        className="text-center"
                        style={{
                          backgroundColor: "darkred",
                          color: "orange",
                          border: "1px solid black",
                        }}
                      >
                        -
                      </td>
                    ))}
                {/* Total score cell */}
                <td
                  className="text-center"
                  style={{
                    backgroundColor: "darkred",
                    color: "yellow",
                    border: "1px solid black",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  {currentUser.lastGame ? currentUser.lastGame.totalScore : "-"}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Button variant="secondary" onClick={redirectToHistory}>
            View History
          </Button>
        </Col>
      </Row>
      {/* Additional sections for features like game history, analytics, etc., can be added here */}
    </Container>
  );
};

export default Dashboard;
