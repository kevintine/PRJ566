import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";
import { Table, Alert, Spinner } from "react-bootstrap";

const GameHistory = () => {
  const [userDetails, setUserDetails] = useState({ bowlingAlley: [] }); // Initialize userDetails with a bowlingAlley array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.id) {
      axios
        .get(`http://localhost:8080/api/users/${currentUser.id}`)
        .then((response) => {
          setUserDetails(response.data); // Assuming this data structure matches your provided object
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || "Failed to fetch user details."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("User not authenticated.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Game History</h2>
      {userDetails.bowlingAlley.length > 0 ? (
        userDetails.bowlingAlley.map((alley, index) => (
          <div key={index}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Frame</th>
                  <th>Roll 1</th>
                  <th>Roll 2</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {alley.frames.map((frame, frameIndex) => (
                  <tr key={frameIndex}>
                    <td>{frameIndex + 1}</td>
                    <td>{frame.roll1}</td>
                    <td>{frame.roll2}</td>
                    <td>{frame.score}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))
      ) : (
        <p>No game history available.</p>
      )}
    </div>
  );
};

export default GameHistory;
