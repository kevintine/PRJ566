// PRJ566-MASTER/react-jwt-auth/src/pages/QuickStart/UserNumber.js

import React, { useState } from "react";
import "./UserNumber.css";
import axios from "axios";

const UserNumber = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [userNames, setUserNames] = useState(Array(1).fill(""));
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameEnded, setGameEnded] = useState(false); // Add state for game end

  const handleSelectUser = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfUsers(value);
    setUserNames(Array(value).fill(""));
    setPlayers([]);
  };

  const handleUserNameChange = (index, value) => {
    const newNames = [...userNames];
    newNames[index] = value;
    setUserNames(newNames);
  };

  const handlePlayGame = async () => {
    const tempPlayers = userNames.map((name, index) => ({
      id: index + 1,
      name: name || `Player ${index + 1}`,
      score: Math.floor(Math.random() * 101), // Generate random score
    }));
    setPlayers(tempPlayers);
    setShowScoreBoard(true);
    setGameEnded(false); // Reset game end state

    try {
      await axios.post("http://localhost:8080/api/saveTempUserScores", {
        users: tempPlayers,
      });
    } catch (error) {
      console.error("Failed to save temporary user scores:", error);
    }
  };

  const handleEndGame = () => {
    setGameEnded(true);
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
      {showScoreBoard && (
        <div>
          <h2>Score Board</h2>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name}: {player.score}
              </li>
            ))}
          </ul>
          {!gameEnded && <button onClick={handleEndGame}>End Game</button>}
        </div>
      )}
    </div>
  );
};

export default UserNumber;




/*
import React, { useState } from "react";
import "./UserNumber.css";


const UserNumber = ({ onSelectUser, onStartGame }) => {
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [userNames, setUserNames] = useState(Array(1).fill(""));

  const handleSelectUser = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfUsers(value);
    if (typeof onSelectUser === 'function') {
      onSelectUser(value);
    }
    setUserNames(Array(value).fill(""));
  };

  const handleUserNameChange = (index, value) => {
    const newNames = [...userNames];
    newNames[index] = value;
    setUserNames(newNames);
  };

  const handlePlayGame = () => {
    
    const players = userNames.map((name, index) => ({
      id: index + 1,
      name: name || `Player ${index + 1}`,
      score: 0, // Initialize score to 0
    }));

    if (typeof onStartGame === 'function') {
      onStartGame(players);
    }
    
  };

  return (
    <div className="container">
      <label htmlFor="userNumber">Select Number of Users:</label>
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
      {userNames.map((name, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Player ${index + 1} Nickname`}
          value={name}
          onChange={(e) => handleUserNameChange(index, e.target.value)}
        />
      ))}
      <button onClick={handlePlayGame}>Play Game</button>
    </div>
  );
};

export default UserNumber;
*/