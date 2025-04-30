export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  completed?: boolean;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
} 