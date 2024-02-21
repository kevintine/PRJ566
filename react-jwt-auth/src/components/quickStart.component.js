// PRJ566-MASTER/react-jwt-auth/src/pages/QuickStart/UserNumber.js

import React, { useState } from "react";
import axios from "axios";
import BowlingScoreDisplay from "./bowlingScoreDisplay.component"; // Import BowlingScoreDisplay component

const bowlingAlleyNumber = 1;

const UserNumber = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [userNames, setUserNames] = useState(Array(1).fill(""));
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameEnded, setGameEnded] = useState(false); // Add state for game end
  const [tempUsersSaved, setTempUsersSaved] = useState(false); // Add state for saving temporary users
  const [gameSaved, setGameSaved] = useState(false); // Add state for saving game in the system
  const [gameId, setGameId] = useState(null);

  const handleSelectUser = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfUsers(value);
    setUserNames(Array(value).fill(""));
    setPlayers([]);
    setTempUsersSaved(false); // Reset state when user selection changes
  };

  const handleUserNameChange = (index, value) => {
    const newNames = [...userNames];
    newNames[index] = value;
    setUserNames(newNames);
  };

  const handlePlayGame = async () => {
    const tempPlayers = userNames.map((name, index) => ({
      id: index + 1,
      username: name || `Player ${index + 1}`,
      bowlingAlleyNumber: bowlingAlleyNumber,
    }));
    setPlayers(tempPlayers);
    setShowScoreBoard(true);
    setGameEnded(false); // Reset game end state

    try {
      await axios.post("http://localhost:8080/saveTempUserScores", {
        users: tempPlayers,
      });
      setTempUsersSaved(true); // Set state to indicate temporary users are saved
    } catch (error) {
      console.error("Failed to save temporary user scores:", error);
    }
  };

  const handleEndGame = () => {
    setGameEnded(true);
    // Reset other state variables to their initial values
    setNumberOfUsers(1);
    setUserNames(Array(1).fill(""));
    setShowScoreBoard(false);
    setPlayers([]);
    setTempUsersSaved(false);
  };
  

  const handleRemoveAll = async () => {
    try {
      await axios.delete("http://localhost:8080/removeTempUsers");
      await axios.delete(`http://localhost:8080/delete-game/${gameId}`);
      setGameSaved(false); // Reset state after removing the game
    } catch (error) {
      console.error("Failed to remove the game:", error);
    }
  };

  
  const handleGameIdChange = (id) => {
    setGameId(id);
  };
  return (
    <div className="container">
      <label htmlFor="userNumber">Select Number of Players:</label>
      <select id="userNumber" value={numberOfUsers} onChange={handleSelectUser}>
        {[...Array(6).keys()].map((num) => (
          <option key={num + 1} value={num + 1}>
            {num + 1}
          </option>
        ))}
      </select>
      {userNames.map((name, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Player ${index + 1}`}
          value={name}
          onChange={(e) => handleUserNameChange(index, e.target.value)}
        />
      ))}
      <button onClick={handlePlayGame}>Play Game</button>
      {showScoreBoard &&
        tempUsersSaved && ( // Conditionally render BowlingScoreDisplay
          <BowlingScoreDisplay onGameIdChange={handleGameIdChange} />
        )}
{showScoreBoard && (
        <div>
          {!gameEnded && !gameSaved && (
            <>
              <button onClick={handleRemoveAll}>Remove Game From Database</button>
            </>
          )}
          {!gameEnded && gameSaved && <p>Game saved in the system.</p>}
          {!gameEnded && <button onClick={handleEndGame}>End Game</button>}
        </div>
      )}
    </div>
  );
};

export default UserNumber;