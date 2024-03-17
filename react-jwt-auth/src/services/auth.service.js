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

  deleteUser(userId) {
    return axios
      .delete(API_URL + `delete/${userId}`)
      .then((response) => {
        console.log("Delete success:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Delete error:", error);
        throw error;
      });
  }

  updateUser(data) {
    const headers = {
      "Content-Type": "application/json",
      ...authHeader(),
    };
    console.log("Headers:", headers);
    console.log("formData", data);
    const config = { headers };
    return axios
      .put(API_URL + "update", data, config)
      .then((response) => {
        console.log("Update success:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Update error:", error);
        throw error;
      });
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
