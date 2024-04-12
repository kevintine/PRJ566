import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import "./bowlingScoreDisplay.css";

const BowlingScoreDisplay = ({ onGameIdChange }) => {
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [frames, setFrames] = useState([]);
  const [gameEnded, setGameEnded] = useState(false); // State to track if the game has ended

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/sse');

    let currentFrameIndex = -1;

    eventSource.onmessage = (event) => {
      const newFrame = JSON.parse(event.data);
      setFrames((prevFrames) => {
        const updatedFrames = [...prevFrames];
        updatedFrames[currentFrameIndex] = newFrame;
        return updatedFrames;
      });
      currentFrameIndex = (currentFrameIndex + 1) % (users.length * 9);
      if ((currentFrameIndex + 1) === users.length * 9 ) {
        setGameEnded(true); // Check if all frames for all users have been received
      }
    };

    return () => {
      eventSource.close();
    };
  }, [users.length]);

  useEffect(() => {
    updateTotalScores();
  }, [frames]);

  const updateTotalScores = () => {
    const updatedUsers = users.map((user, userIndex) => {
      let totalScore = 0;
      for (let i = 0; i < frames.length; i += users.length) {
        const frame = frames[i + userIndex];
        if (frame) {
          totalScore += frame.score;
        }
      }
      return { ...user, totalScore };
    });
    setUsers(updatedUsers);
  };

  useEffect(() => {
    handlePopulateTable();
  }, []); // Empty dependency array ensures the effect runs only once, on mount

  const handlePopulateTable = async () => {
    try {
      let numberOfUsers;
      // Send a request to your backend API with the bowlingAlleyNumber as a URL parameter
      const usersResponse = await axios.get("http://localhost:8080/tempUsers/1");
      if (usersResponse.status === 200) {
        const usersData = usersResponse.data; // Assuming response.data contains the array of users
        setUsers(usersData);
        numberOfUsers = usersData.length; // Get the number of users
        setShowTable(true);
      } else {
        console.error("Failed to fetch users");
      }

      // Send a request to your backend API with the bowlingAlleyNumber as a URL parameter
      const response = await axios.post(`http://localhost:8080/create-new-game/1/${numberOfUsers}`);

      // Check if the request was successful
      if (response.status === 200) {
        // Toggle the showTable state to true
        setShowTable(true);
        
        // Extract the gameId from the response data
        const { gameId } = response.data;

        // Set the gameId in the component state
        setGameId(gameId);

        onGameIdChange(gameId);
      } else {
        // Handle error if the request was not successful
        console.error("Failed to initialize game");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error initializing game:", error);
    }

    setShowTable(true);
  };

  return (
<div className={`bowling-table-container ${gameEnded ? 'game-ended' : ''}`}>
  <Table bordered className="bowling-table">
    <thead>
      <tr>
        <th className="align-middle fixed-width-name">Player</th>
        {[...Array(9)].map((_, index) => (
          <th key={index} className="align-middle">Round {index + 1}</th>
        ))}
        <th className="align-middle">Total</th>
      </tr>
    </thead>
    <tbody>
      {showTable && 
        users.map((user, userIndex) => (
          <tr key={userIndex}>
            <td className="align-middle fixed-width-name">{user.username}</td>
            {[...Array(9)].map((_, frameIndex) => {
              const frame = frames[frameIndex * users.length + userIndex];
              return (
                <td key={frameIndex} className="align-middle">
                  {frame && (
                    <div className="frame-info">
                    <div className="roll-score-container">
                      <div className="roll-box">
                        {frame.roll1}
                      </div>
                      <div className="roll-box">
                        {frame.roll2}
                      </div>
                    </div>
                    <div className={`score-box ${gameEnded ? 'game-ended' : ''}`}>
                      {frame.score}
                    </div>
                  </div>
                  
                  )}
                </td>
              );
            })}
            <td className="align-middle">{user.totalScore || 0}</td>
          </tr>
        ))
      }
    </tbody>
  </Table>
</div>

  );
};

export default BowlingScoreDisplay;



