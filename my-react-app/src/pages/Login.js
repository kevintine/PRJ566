import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


function Login(){
    const LoginPageStyle = {
        backgroundColor: '#9f5afd', // Replace with your desired color
        color: '#fff', // Text color
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

    return(
            <div style={LoginPageStyle}>
                <div style={buttonContainerStyle}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                    <Link to="/authentication">Sign in with Yahooo</Link>
                </div>
            </div>
    )
}

export default Login;