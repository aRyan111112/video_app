import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true, // Important for cookies/JWT
});

// Optionally add interceptors here
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirect to login');
      // window.location.href = '/login'; // Or use React Router
    }
    return Promise.reject(error);
  }
);

export default api;
