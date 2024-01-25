// LoginPage.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Call the login API.
      const response = await axios.post("http://localhost:5000/LoginPage", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;

        // Save the token (store in local storage, etc.).
        localStorage.setItem("token", token);

        // Redirect to MyPage upon successful login.
        window.location.href = "/MyPage";
      } else {
        console.log("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
};

const handleRecoverPassword = () => {
  // Navigate to the withdrawal page.
  navigate("/recoverpassword");
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      <label>E-mail:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRecoverPassword}>Forgot Password?</button>
    </div>
  );
};

export default LoginPage;