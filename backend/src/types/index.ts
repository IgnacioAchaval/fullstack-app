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
  description?: string;
  completed?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Database related types
export interface DatabaseError extends Error {
  code?: string;
  constraint?: string;
}

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
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