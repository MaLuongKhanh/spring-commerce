import axios from 'axios';
import { AuthResponse, User } from '../types';

const API_URL = 'http://localhost:8080/api/auth/';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

class AuthService {
  // Lưu token vào localStorage
  setTokens(accessToken: string, refreshToken: string, user: User) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', user.id.toString());
  }

  // Lấy access token từ localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Lấy refresh token từ localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Xóa tokens khi logout
  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }

  // Đăng nhập
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_URL + 'authenticate', {
      email,
      password,
    });
    if (response.data.accessToken && response.data.user) {
      this.setTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
    }
    return response.data;
  }

  // Đăng ký
  async register(firstname: string, lastname: string, email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(API_URL + 'register', {
      firstname,
      lastname,
      email,
      password,
    });
    if (response.data.accessToken && response.data.user) {
      this.setTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
    }
    return response.data;
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthResponse>(
      API_URL + 'refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response.data.accessToken && response.data.user) {
      this.setTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
    }
    return response.data;
  }

  // Logout
  logout() {
    this.removeTokens();
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}

export default new AuthService(); 