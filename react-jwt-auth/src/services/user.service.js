import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
  getPaymentMethods(userId) {
    return axios.get(`http://localhost:8080/user/payment-methods/${userId}`, {
      headers: authHeader(),
    });
  }

  addPaymentMethod(userId, paymentMethod) {
    return axios.post(
      `http://localhost:8080/user/payment-methods/${userId}`,
      paymentMethod,
      { headers: authHeader() }
    );
  }

  verifyCardCvv(cardNumber, cvv) {
    return axios.post(
      `${API_URL}verify-cvv`,
      { cardNumber, cvv },
      { headers: authHeader() }
    );
  }

  removePaymentMethod(userId, cardNumber) {
    return axios.delete(
      `http://localhost:8080/user/payment-methods/${userId}/${cardNumber}`,
      { headers: authHeader() }
    );
  }

  getOrderDetails(orderId) {
    return axios.get(`http://localhost:8080/api/orders/${orderId}`, {
      headers: authHeader(),
    });
  }
}
const userServiceInstance = new UserService();

// Export the variable as the default module
export default userServiceInstance;