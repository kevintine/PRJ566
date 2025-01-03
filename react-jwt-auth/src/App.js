import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import RecoverPassword from "./components/recoverPassword.component";
import ResetPassword from "./components/resetPassword.component";
import Dashboard from "./components/dashboard.component";
import MaintenanceScheduler from "./components/MaintenanceScheduler";
import ReportScheduler from "./components/ReportScheduler";
import SummaryPage from "./components/SummaryPage";
import OrderPage from "./components/OrderPage";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import GameHistory from "./components/history.component";
import UserNumber from "./components/quickStart.component";
import BowlingScoreDisplay from "./components/bowlingScoreDisplay.component";
import Payment from "./components/payment.component";
import Checkout from "./components/checkout.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Bowling Alley
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/dashboard"} className="nav-link">
                  Dashboard
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/maintenance"} className="nav-link">
                  Schedule Maintenance
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/reports"} className="nav-link">
                  Schedule Reports
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/recoverpassword" element={<RecoverPassword />} />
            <Route path="/resetpassword/:email" element={<ResetPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<GameHistory />} />
            <Route path="/quickStart" element={<UserNumber />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/bowlingScoreDisplay"
              element={<BowlingScoreDisplay />}
            />
            <Route path="/maintenance" element={<MaintenanceScheduler />} />
            <Route path="/reports" element={<ReportScheduler />} />
            <Route path="/summary" element={<SummaryPage />} /> 
            <Route path="/orders" element={<OrderPage />} />
          </Routes>
        </div>

        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
