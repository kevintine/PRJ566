import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


function Login(){
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [loginError, setLoginError] = useState(false); // State for login error
    const navigate = useNavigate();


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Authentication with dummy data
        if (formData.email === 'seneca@edu.ca' && formData.password === 'pwd') {
          // Successful login
          // Redirect the user to the index page
          navigate('/home');
        } else {
          // Failed login
          setLoginError(true);
        }
        console.log('Form submitted with data:', formData);
    };

    const LoginPageStyle = {
        backgroundColor: '#9f5afd', // Replace with your desired color
        color: 'black', // Text color
        minHeight: '100vh', // Ensure the color covers the full height of the viewport
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const buttonContainerStyle = {
        backgroundColor: '#ecf0f1', // Light gray color for the button container
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px',
    };
    const labelStyle = {
        textAlign: 'right', // Adjust the text alignment here
        marginRight: '10px', 
        width: '80px', // Adjust the width to align the labels uniformly
      };

    return(
        <div style={LoginPageStyle}>
        <div style={buttonContainerStyle}>
          
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <br/>
            <div>
              <label htmlFor="password" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <br/>
            <br/>
            <div>
              <button type="submit">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default Login;