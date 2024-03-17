import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

<<<<<<< HEAD
  setCurrentUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

=======
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  }
  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }

<<<<<<< HEAD
  history(userId) {
    console.log(userId);

    return axios
      .get(API_URL + `history/${userId}`)
      .then((response) => {
        console.log("History:", response.data);
=======
  /*recoverPassword(data) {
    const headers = {
      "Content-Type": "application/json",
      ...authHeader(),
    };
    console.log("Recover Headers:", headers);
    console.log("formData", data);
    const config = { headers };
    return axios
      .put(API_URL + "recover", data, config)
      .then((response) => {
        console.log("Recover success:", response.data);
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
        // Handle success, if needed
        return response.data;
      })
      .catch((error) => {
<<<<<<< HEAD
        console.error("History:", error);
        // Handle error, if needed
        throw error;
      });
  }
=======
        console.error("Recover error:", error);
        // Handle error, if needed
        throw error;
      });
  }*/
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a

  deleteUser(userId) {
    console.log(userId);

    return axios
      .delete(API_URL + `delete/${userId}`)
      .then((response) => {
        console.log("Delete success:", response.data);
        // Handle success, if needed
        return response.data;
      })
      .catch((error) => {
        console.error("Delete error:", error);
        // Handle error, if needed
        throw error;
      });
  }

<<<<<<< HEAD
  uploadProfilePicture(formData) {
    const headers = {
      "Content-Type": "multipart/form-data",
      ...authHeader(),
    };

    return axios
      .post(API_URL + "upload", formData, { headers })
      .then((response) => {
        // Assuming the server response includes the path of the uploaded profile picture
        if (response.data.profilePicturePath) {
          // Get the current user data from localStorage
          const currentUser = JSON.parse(localStorage.getItem("user"));
          // Update the currentUser object with the new profile picture path
          const updatedUser = {
            ...currentUser,
            profilePicture: response.data.profilePicturePath,
          };
          // Save the updated user data back to localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));

          console.log("Profile picture uploaded successfully.");
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error uploading profile picture:", error);
        // Handle error, if needed
        throw error;
      });
  }

=======
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
  updateUser(data) {
    const headers = {
      "Content-Type": "application/json",
      ...authHeader(),
    };
<<<<<<< HEAD

=======
    console.log("Headers:", headers);
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
    console.log("formData", data);
    const config = { headers };
    return axios
      .put(API_URL + "update", data, config)
      .then((response) => {
        console.log("Update success:", response.data);
        // Handle success, if needed
<<<<<<< HEAD
        if (response.data.accessToken) {
          // If the response includes a new accessToken, update it as well
          localStorage.setItem(
            "user",
            JSON.stringify({ ...data, accessToken: response.data.accessToken })
          );
        } else {
          // If no new accessToken, just update the user data
          const currentUser = JSON.parse(localStorage.getItem("user"));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...currentUser, ...data })
          );
        }
=======
>>>>>>> c02d48749df7e4423ec155b58ac2efc62bc5a95a
        return response.data;
      })
      .catch((error) => {
        console.error("Update error:", error);
        // Handle error, if needed
        throw error;
      });
  }
}

// Assign instance to a variable
const authServiceInstance = new AuthService();

// Export the variable as the default module
export default authServiceInstance;
