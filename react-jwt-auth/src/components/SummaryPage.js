import React from 'react';
import { useLocation } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation();
  const { reportData } = location.state;

  // Define a variable to hold the message
  let message = null;

  // Check if reportData exists
  if (reportData) {
    // If reportData exists, set the message
    message = <p style={styles.message}>We have received your report. Thank you!</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Report Summary</h2>
      <div style={styles.summary}>
        <p><strong>Date:</strong> {reportData.date}</p>
        <p><strong>Email:</strong> {reportData.email}</p>
        <p><strong>User Name:</strong> {reportData.username}</p>
        <p><strong>Phone Number:</strong> {reportData.phoneNumber}</p>
        <p><strong>Additional Information:</strong> {reportData.additionalInfo}</p>
      </div>
      {message} {/* Render the message here */}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  summary: {
    fontSize: '18px',
    lineHeight: '1.6',
  },
  message: {
    marginTop: '40px', 
    fontSize: '20px', 
    color: '#4CAF50',
    textAlign: 'center',
  },
};

export default SummaryPage;
