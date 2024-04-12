import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";

import "./Profile.css";

const Profile = ({ onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // Initialize to null
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "" });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);
    setFullName(currentUser.fullName || "");
    setEmail(currentUser.email || "");
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setError(null);
    if (name === "email") {
      setEmail(value);
    } else {
      setFullName(value);
    }
  };

  const deleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const userId = currentUser.id;
        await AuthService.deleteUser(userId);
        AuthService.logout();
        setRedirect("/home");
      } catch (error) {
        console.error("Error deleting account:", error);
        setError("An error occurred while deleting the account.");
      }
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      fullName: fullName,
      email: email,
      profilePicture: profilePicture, // Send the profile picture URL to the server
    };

    try {
      await AuthService.updateUser(data);
      setSuccessMessage(
        "Profile updated successfully. Please log out and log in again to see the updates."
      );
      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating user.");
      setLoading(false);
    }
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      // For immediate preview without waiting for upload completion
      // Note: Consider uploading and updating the profile picture URL upon successful upload
    }
  };
  const handleProfilePicSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.uploadProfilePicture(formData);
      console.log("Upload response:", response.data);
      setSuccessMessage("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload profile picture.");
    }

    setLoading(false);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!userReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <form onSubmit={saveProfile}>
        <div className="profile-info">
          <div className="profile-picture-wrapper">
            <img
              src={
                profilePicture
                  ? typeof profilePicture === "string"
                    ? profilePicture
                    : URL.createObjectURL(profilePicture)
                  : "default-profile.png"
              } // Use a default image if no profile picture is set
              alt="Profile"
              className="profile-pic"
            />
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
            <label htmlFor="profilePicInput" className="upload-button">
              Choose Picture
            </label>
            <button
              type="button"
              onClick={handleProfilePicSubmit}
              className="upload-button"
            >
              Upload
            </button>
          </div>
          <div className="profile-details-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="profile-details">
          <h2 className="profile-username">{currentUser.username}</h2>
          <div className="profile-item">
            <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)}{" "}
            ...{" "}
            {currentUser.accessToken.substr(
              currentUser.accessToken.length - 20
            )}
          </div>
          <div className="profile-item">
            <strong>Id:</strong> {currentUser.id}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {currentUser.email}
          </div>
          <div className="profile-item">
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
            </ul>
          </div>
        </div>

        <div className="buttons">
          <button type="submit" disabled={loading} className="btn-save">
            Save
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="button" onClick={deleteUser} className="btn-delete">
            Delete Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
