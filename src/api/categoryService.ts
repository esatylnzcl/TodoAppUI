import axiosInstance from './axios';
import type { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<ApiResponse<Category[]>>('/Category');
    return response.data.data; // ← .data.data
  },

  async getCategory(id: number): Promise<Category> {
    const response = await axiosInstance.get<ApiResponse<Category>>(`/Category/${id}`);
    return response.data.data; // ← .data.data
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await axiosInstance.post<ApiResponse<Category>>('/Category', data);
    return response.data.data; // ← .data.data
  },

  async updateCategory(data: UpdateCategoryData): Promise<Category> {
    const response = await axiosInstance.put<ApiResponse<Category>>('/Category', data);
    return response.data.data; // ← .data.data
  },

  async deleteCategory(id: number): Promise<void> {
    await axiosInstance.delete(`/Category/${id}`);
  },
};
