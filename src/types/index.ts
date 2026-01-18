// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    expiration?: string;
  };
  success: boolean;
  message: string;
}

// Task Types
export const TaskStatus = {
  Todo: 0,
  InProgress: 1,
  Completed: 2,
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskStatusLabels = {
  [TaskStatus.Todo]: 'Yapılacak',
  [TaskStatus.InProgress]: 'Devam Ediyor',
  [TaskStatus.Completed]: 'Tamamlandı',
} as const;

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  categoryId: number;
  categoryName?: string; // Backend'den dönen kategori adı
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  categoryId: number;
  startDate: string;
  endDate: string;
}

export interface UpdateTaskData {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  categoryId: number;
  startDate: string;
  endDate: string;
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
