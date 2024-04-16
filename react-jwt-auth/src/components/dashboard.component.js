import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { Container, Row, Col, Button, Image, Table } from "react-bootstrap";
import "./dashboard.css";
import axios from "axios";

import { Modal } from "react-bootstrap";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({ previousGames: [] });
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
      if (currentUser && currentUser.id) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/users/${currentUser.id}`
          );
          setUserDetails(response.data);
          setCurrentUser(currentUser);
        } catch (err) {
          console.error(
            err.response?.data?.message || "Failed to fetch user details."
          );
        } finally {
          setLoading(false);
        }
      } else {
        console.error("User not authenticated.");
        setLoading(false);
        setRedirect("/login");
      }
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
    setRedirect("/analytic");
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
          <h1 className="username">{userDetails.fullName}</h1>
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
          <h2>Last Game Played</h2>
          {userDetails.previousGames.length > 0 ? (
            userDetails.previousGames.map((pgame, index) => (
              <div key={index}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                        }}
                      >
                        Frame
                      </th>
                      <th
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                        }}
                      >
                        Roll 1
                      </th>
                      <th
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                        }}
                      >
                        Roll 2
                      </th>
                      <th
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                        }}
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pgame.frames.map((frame, frameIndex) => (
                      <tr
                        key={frameIndex}
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                        }}
                      >
                        <td
                          style={{
                            backgroundColor: "darkred",
                            color: "white",
                            border: "1px solid black",
                          }}
                        >
                          {frameIndex + 1}
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkred",
                            color: "yellow",
                            border: "1px solid black",
                          }}
                        >
                          {frame.roll1}
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkred",
                            color: "yellow",
                            border: "1px solid black",
                          }}
                        >
                          {frame.roll2}
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkred",
                            color: "yellow",
                            border: "1px solid black",
                          }}
                        >
                          {frame.score}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center"
                        style={{
                          backgroundColor: "darkgreen",
                          color: "lightgreen",
                          border: "1px solid black",
                          fontWeight: "bold",
                        }}
                      >
                        Total Score: {pgame.totalScore}&nbsp;&nbsp;&nbsp;
                        Strikes: {pgame.strikes}&nbsp;&nbsp;&nbsp; Spares:
                        {pgame.spares}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))
          ) : (
            <p>No game history available.</p>
          )}
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
