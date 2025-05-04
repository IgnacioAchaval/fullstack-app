import { pool } from '../config/database';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    try {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        [task.title, task.description || null, task.completed || false]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw new ApiError(500, 'Error creating task');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new ApiError(500, 'Error fetching tasks');
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new ApiError(404, 'Task not found');
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Error fetching task:', error);
      throw new ApiError(500, 'Error fetching task');
    }
  }

  async updateTask(id: number, task: UpdateTaskDTO): Promise<Task> {
    try {
      const result = await pool.query(
        `UPDATE tasks
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed)
         WHERE id = $4
         RETURNING *`,
        [task.title || null, task.description || null, task.completed, id]
      );
      if (result.rows.length === 0) {
        throw new ApiError(404, 'Task not found');
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Error updating task:', error);
      throw new ApiError(500, 'Error updating task');
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        throw new ApiError(404, 'Task not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Error deleting task:', error);
      throw new ApiError(500, 'Error deleting task');
    }
  }
} 