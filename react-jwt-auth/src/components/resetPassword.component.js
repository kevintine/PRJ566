import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { email: paramEmail } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || paramEmail;

  useEffect(() => {
    // Any side effects or initialization code can go here
  }, []); // The empty dependency array means this effect will run once after the initial render

  const handlePasswordChange = async () => {
    try {
      // Send a PUT request to update the password
      const response = await fetch(
        `http://localhost:8080/update-password/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const updatedUser = await response.json();
      console.log("Password updated:", updatedUser);
      // Redirect to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const LoginPageStyle = {
    backgroundColor: "#9f5afd",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 1rem",
  };

  return (
    <div style={LoginPageStyle}>
      <h2>Reset Password</h2>
      <label htmlFor="newPassword">New Password:</label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordChange} style={{ marginTop: "1rem" }}>
        Change Password
      </button>
    </div>
  );
};

export default ResetPassword;
