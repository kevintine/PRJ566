import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import bowlingBackground from "../assets/images/BowlingbackGround.png";
import AuthService from "../services/auth.service";
import "./home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
    // Fetch current user's information 
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      this.setState({ currentUser: currentUser });
    }
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div>
        <div className="hero-section" style={{ backgroundImage: `url(${bowlingBackground})`, 
                                              backgroundSize: 'cover', 
                                              backgroundPosition: 'center',
                                              height: '75vh',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              textAlign: 'center' }}>
        <div className="hero-content">
          <h1>Welcome to lucky strike Bowling</h1>
          <p>Experience the thrill of bowling game and start now!</p>
          <Link to="/game" className="btn">
            Quick Start !
          </Link>
        </div>
      </div>
      <div className="cards container mt-1">
      <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Online Orders</h5>
                  <p className="card-text">Order drinks and food online for your convenience.</p>
                  <Link to="/orders" className="btn btn-primary">Order Now</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Player Rankings</h5>
                  <p className="card-text">Check out the latest player rankings and see where you stand.</p>
                  <Link to="/rankings" className="btn btn-primary">View Rankings</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Lucky Strike</h5>
                  <p className="card-text">
                    {currentUser ? (
                      `Welcome, ${currentUser.username}!`
                    ) : (
                      <>
                        Please{" "}
                        <Link to="/login">log in</Link> to join our club.
                      </>
                    )}
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
      
    );
  }
}
