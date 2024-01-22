// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Your Company Name. All rights reserved.</p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '10px',
  textAlign: 'center',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

export default Footer;
