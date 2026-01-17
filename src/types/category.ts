// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  id: number;
  name: string;
  description?: string;
}
