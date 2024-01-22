import React, { useState } from 'react';

const EmailInput = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
      // Make a POST request to the backend to send the email
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Handle the response, maybe show a success message to the user
    const data = await response.json();
    console.log(data.message);
  };

  const LoginPageStyle = {
    backgroundColor: '#FF9A9A',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={LoginPageStyle}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Submit
      </button>
      <p>You entered: {email}</p>
    </div>
  );
};

function RecoverPassword() {
  return <EmailInput />;
}

export default RecoverPassword;