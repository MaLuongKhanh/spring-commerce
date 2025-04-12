import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot backend API base URL
  timeout: 10000, // Optional: Set a request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request/response handling (e.g., adding auth tokens)
// axiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem('token'); // Example: Get token from local storage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default axiosInstance;
