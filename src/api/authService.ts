import axiosInstance from "./axios";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types";

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
    
    const token = response.data.data.accessToken;
    const decoded = decodeJWT(token);
    
    const user: User = {
      id: decoded.nameid || decoded.sub,
      username: decoded.unique_name,
      email: decoded.email,
      firstName: decoded.FirstName,
      lastName: decoded.LastName,
    };
    
    return { user, token };
  },

  async register(data: RegisterData): Promise<{ user?: User; token?: string; success: boolean; message: string }> {
    const response = await axiosInstance.post(
      "/Auth/register",
      data
    );
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Successfully registered"
      };
    }
    
    throw new Error(response.data.message || "Registration failed");
  },
};
