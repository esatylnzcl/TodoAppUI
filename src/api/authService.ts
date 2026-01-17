import axiosInstance from "./axios";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types";

// JWT token'ı decode etmek için helper fonksiyon
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await axiosInstance.post<AuthResponse>(
      "/Auth/login",
      credentials
    );
    console.log('Login Response:', response.data); // Debug
    
    const token = response.data.data.accessToken; // ← .data.accessToken değil
    const decoded = decodeJWT(token);
    console.log('Decoded JWT:', decoded); // Debug
    
    // JWT'den user objesi oluştur
    const user: User = {
      id: decoded.nameid || decoded.sub,
      username: decoded.unique_name,
      email: decoded.email,
      firstName: decoded.FirstName,
      lastName: decoded.LastName,
    };
    
    return { user, token };
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await axiosInstance.post<AuthResponse>(
      "/Auth/register",
      data
    );
    console.log('Register Response:', response.data); // Debug
    
    const token = response.data.data.accessToken; // ← .data.accessToken değil
    const decoded = decodeJWT(token);
    console.log('Decoded JWT:', decoded); // Debug
    
    // JWT'den user objesi oluştur
    const user: User = {
      id: decoded.nameid || decoded.sub,
      username: decoded.unique_name,
      email: decoded.email,
      firstName: decoded.FirstName,
      lastName: decoded.LastName,
    };
    
    return { user, token };
  },
};
