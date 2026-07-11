import axios from 'axios';
import Cookies from 'js-cookie';

// Create an Axios instance pointing to the backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if your backend runs on a different port/host
});

// Add a request interceptor to attach the JWT token automatically
API.interceptors.request.use(
  (config) => {
    // Extract the token from cookies
    const token = Cookies.get('token');
    
    if (token) {
      // Append token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
