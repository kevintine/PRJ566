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
  const [profilePicture, setProfilePicture] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "" });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);

    // Populate profile fields with user details
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
    } else {
      setProfilePicture(null);
      setError("Invalid file type. Please select an image.");
    }
  };

  const deleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        const userId = currentUser.id;
        await AuthService.deleteUser(userId);

        // Logout the user
        AuthService.logout();

        // Redirect to the home page after account deletion
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
    };

    if (profilePicture) {
      // If you want to include profilePicture, add it to the data object
      data.profilePicture = profilePicture;
    }

    console.log("data", data);

    try {
      await AuthService.updateUser(data);

      // Reload the page after successful update
      window.location.reload();
      setSuccessMessage(
        "Profile updated successfully. Please log out and log in again to see the updates."
      );
      // Alternatively, you can call a function passed as onSave prop to handle the reload
      // onSave();

      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating user.");
      setLoading(false);
    }
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
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="profilePicture">Profile Picture:</label>
        <input type="file" name="profilePicture" onChange={handleFileChange} />
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button type="submit" disabled={loading}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
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
        <button
          type="button"
          onClick={deleteUser}
          className="delete-account-button"
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default Profile;
