import React, { useState, useEffect } from "react";
//import axios from "axios";
import { Table, Alert, Spinner } from "react-bootstrap";
import AuthService from "../services/auth.service";

const GameHistory = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const Currentuser = AuthService.getCurrentUser();
      console.log("Current user:", Currentuser);
      const userId = Currentuser?.id;

      if (userId) {
        try {
          const response = await AuthService.history(userId);
          setGames(response.data || []);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("User ID is undefined");
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <div>
      <h2>Game History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Score</th>
            <th>Strikes</th>
            <th>Spares</th>
            <th>Frames</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game._id}>
              <td>{new Date(game.gameDate).toLocaleDateString()}</td>
              <td>{game.totalScore}</td>
              <td>{game.strikes}</td>
              <td>{game.spares}</td>
              <td>
                {game.frames?.map((frame, index) => (
                  <div key={index}>{`Frame ${index + 1}: ${frame.roll1}, ${
                    frame.roll2
                  }`}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GameHistory;
