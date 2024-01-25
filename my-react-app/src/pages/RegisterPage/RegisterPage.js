// RegisterPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/RegisterPage', {
        username,
        email,
        password,
      });

      console.log('Sign-up success:', response.data);
    } catch (error) {
      console.error('Sign-up failure:', error.message);
      if (error.response && error.response.status === 409) {
        setErrorMessage('This email already exists.'); // Email conflict.
      } else {
        setErrorMessage('Failed to register user.');
      }
    } finally {
      // Reset all fields after successful or failed registration.
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <label>User name:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>E-mail:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterPage;
