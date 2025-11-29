import axios from 'axios'
import { toast } from 'sonner'


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // Handle 401 - Unauthorized (token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = '/admin/login';
          return Promise.reject(error);
        }

        // Try to refresh token
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // Save new tokens
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    // Show toast based on error status
    if (status === 400) {
      toast.error("Bad Request: Please check your input.");
    } else if (status === 404) {
      toast.error("Not Found: The requested resource does not exist.");
    } else if (status === 500) {
      toast.error("Internal Server Error: Please try again later.");
    } else if (status !== 401) {
      toast.error("An unexpected error occurred.");
    }

    const config = error.config;
    if (!config || config.__isRetryRequest) {
      return Promise.reject(error);
    }

    config.__isRetryRequest = true;

    await new Promise((resolve) => setTimeout(resolve, 5000));
    toast.info("Retrying request...");

    try {
      return await axiosInstance(config);
    } catch (err) {
      return Promise.reject(err);
    }
  }
)

export default axiosInstance
