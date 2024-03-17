import React, { Component } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import bowlingBackground from "../assets/images/BowlingbackGround.png";
import "./home.css";
=======

import UserService from "../services/user.service";
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
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
  }

  render() {
    return (
<<<<<<< HEAD
      <div>
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${bowlingBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "75vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div className="hero-content">
            <h1>Welcome to lucky strike Bowling</h1>
            <p>Experience the thrill of bowling game and start now!</p>
            <Link to="/quickstart" className="btn">
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
                  <p className="card-text">
                    Order drinks and food online for your convenience.
                  </p>
                  <Link to="/orders" className="btn btn-primary">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Player Rankings</h5>
                  <p className="card-text">
                    Check out the latest player rankings and see where you
                    stand.
                  </p>
                  <Link to="/rankings" className="btn btn-primary">
                    View Rankings
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Join Our Club</h5>
                  <p className="card-text">
                    Become a member of our bowling club and enjoy exclusive
                    benefits.
                  </p>
                  <Link to="/join" className="btn btn-primary">
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
=======
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
      </div>
    );
  }
}
