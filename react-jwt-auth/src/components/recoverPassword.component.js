import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

class RecoverPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = async () => {
    // Make a POST request to the backend to send the email
    const response = await fetch("http://localhost:8080/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.state.email }),
    });

    // Handle the response, maybe show a success message to the user
    const data = await response.json();
    console.log(data.message);
  };

  render() {
    const LoginPageStyle = {
      backgroundColor: "#FF9A9A",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
    };

    const FormStyle = {
      width: "300px",
      backgroundColor: "#fff",
      padding: "20px",
      boxSizing: "border-box",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const LabelStyle = {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    };

    const InputStyle = {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "10px",
    };

    const ButtonStyle = {
      backgroundColor: "#4CAF50",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    };

    return (
      <div style={LoginPageStyle}>
        <div style={FormStyle}>
          <Form>
            <div style={LabelStyle}>
              <label htmlFor="email">Email:</label>
            </div>
            <Input
              style={InputStyle}
              type="email"
              id="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            <div style={{ textAlign: "center" }}>
              <button onClick={this.handleSubmit} style={ButtonStyle}>
                Submit
              </button>
            </div>
          </Form>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            You entered: {this.state.email}
          </p>
        </div>
      </div>
    );
  }
}

export default RecoverPassword;
