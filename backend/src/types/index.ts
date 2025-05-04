// Task related types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string | null;
  completed: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

// Database related types
export interface DatabaseError extends Error {
  code?: string;
  constraint?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  message?: string;
}

// Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TaskQueryParams extends PaginationParams {
  completed?: boolean;
  search?: string;
} 