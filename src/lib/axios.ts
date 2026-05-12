import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Request Interceptor - بيتشغل قبل كل request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // أو من أي مكان
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // لازمترجع الـ config
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;