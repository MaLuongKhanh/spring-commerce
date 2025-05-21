import axios from 'axios';
import authService from './auth.service';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý refresh token và lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const response = await authService.refreshToken();
        const { accessToken } = response;

        // Cập nhật token mới
        authService.setTokens(accessToken, response.refreshToken, response.user);

        // Thử lại request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout user và chuyển về trang login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    if (error.response?.status === 403) {
      // Lỗi không có quyền truy cập
      window.location.href = '/unauthorized';
      return Promise.reject(error);
    }

    // Nếu có lỗi JWT hoặc lỗi xác thực khác
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 