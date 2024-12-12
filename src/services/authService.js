import axios from "axios";

const API_URL = "https://localhost:7298/api/auth"; // Update with your backend URL

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Return the response data on success
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid login credentials.");
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export default { login };
