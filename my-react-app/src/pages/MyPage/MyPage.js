// MyPage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkExistingEmail } from "../../utils/api";
import "./MyPage.css";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState(""); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/LoginPage");
          return;
        }

        const response = await fetch("http://localhost:5000/MyPage", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          navigate("/LoginPage");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const checkEmailExists = async (email) => {
    try {
      const exists = await checkExistingEmail(email);
      return exists;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  };

  const handleUpdateUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      // Confirm existing password
      if (currentPassword !== user.password) {
        setErrorMessage("The current password does not match.");
        return;
      }

      // Email duplication check
      const emailExists = await checkEmailExists(newEmail);
      if (emailExists) {
        setErrorMessage("That email already exists.");
        return;
      }

      const response = await fetch("http://localhost:5000/MyPage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          username: newUsername || user.username,
          email: newEmail || user.email,
          newPassword,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setErrorMessage("");
        alert("User information has been successfully updated.");
      } else {
        alert("Failed to update user information.");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleWithdrawPage = () => {
    // Navigate to the withdrawal page.
    navigate("/WithdrawPage");
  };

  return (
    <div className="mypage-container">
      <h2>My Page</h2>
      <p>Welcome, {user.username}</p>
      <p>Email: {user.email}</p>
      <div>
        <h3>Update User Information</h3>
        <label>New Username:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <br />
        <label>New Email:</label>
        <input
          type="email"
          value={newEmail}
          onChange={async (e) => {
            setNewEmail(e.target.value);
            setErrorMessage("");
            const exists = await checkEmailExists(e.target.value);
            if (exists) {
              setErrorMessage("That email already exists.");
            }
          }}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <br />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <br />
        <button onClick={handleUpdateUserInfo}>Update</button>
        <br />
        <br />
        <button onClick={handleWithdrawPage}>Withdraw</button>
      </div>
    </div>
  );
};

export default MyPage;
