import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const ResetPassword = ({ userId }) => {
    const { email: paramEmail } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || paramEmail; // Use paramEmail as a fallback
    const [newPassword, setNewPassword] = useState('');

    const LoginPageStyle = {
        backgroundColor: '#9f5afd', // Replace with your desired color
        color: '#fff', // Text color
        minHeight: '100vh', // Ensure the color covers the full height of the viewport
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };
    const handlePasswordChange = async () => {
      console.log(email);
      try {
        // Send a PUT request to update the password
        const response = await fetch(`http://localhost:5000/update-password/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        });
  
        const updatedUser = await response.json();
        console.log('Password updated:', updatedUser);
      } catch (error) {
        console.error('Error updating password:', error);
      }
    };
  
    return (
      <div style={LoginPageStyle}>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
    );
  };
  
  export default ResetPassword;