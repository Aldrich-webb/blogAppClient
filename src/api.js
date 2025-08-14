import axios from "axios";

// Create axios instance - Option 1
const Axios = axios.create({
	baseURL: import.meta.env.VITE_REACT_SERVER_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

// Request Interceptor - Add access token
Axios.interceptors.request.use((config) => {
    
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
		return config;
	}, (error) => {
    Promise.reject(error)
});

export default Axios;