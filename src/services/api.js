import axios from 'axios';

const API_URL = 'https://localhost:7298/api'; // Replace with your actual API URL

const apiErp = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // Ensure headers match your backend's requirements
  },
});

export default apiErp;