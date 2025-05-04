export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
} 