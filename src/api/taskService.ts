import axiosInstance from './axios';
import type { Task, CreateTaskData, UpdateTaskData } from '../types';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await axiosInstance.get<ApiResponse<Task[]>>('/Task');
    return response.data.data; // ← .data.data
  },

  async getTask(id: number): Promise<Task> {
    const response = await axiosInstance.get<ApiResponse<Task>>(`/Task/${id}`);
    return response.data.data; // ← .data.data
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await axiosInstance.post<ApiResponse<Task>>('/Task', data);
    return response.data.data; // ← .data.data
  },

  async updateTask(data: UpdateTaskData): Promise<Task> {
    const response = await axiosInstance.put<ApiResponse<Task>>('/Task', data);
    return response.data.data; // ← .data.data
  },

  async deleteTask(id: number): Promise<void> {
    await axiosInstance.delete(`/Task/${id}`);
  },
};
