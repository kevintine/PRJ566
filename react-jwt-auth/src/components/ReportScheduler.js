import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./sprint4/styles.css";

const ReportScheduler = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    email: "",
    username: "",
    phoneNumber: "",
    additionalInfo: "",
    isLoading: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission and scheduling
    console.log("Form submitted:", formData);
    // Navigate to the summary page after form submission and pass reportData
    navigate("/summary", { state: { reportData: formData } });
  };

  return (
    <div >
      <h2 className="title">Report Scheduler</h2>
      <br />
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>User Name:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Additional Information:</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="form-control"
            rows={formData.additionalInfo.split("\n").length * 6}
          ></textarea>
        </div>
        <br />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formData.isLoading}
        >
          Schedule Report
        </button>
      </form>
    </div>
  );
};

export default ReportScheduler;
