import { Pool } from 'pg';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/Task';
import { AppError } from '../middleware/errorHandler';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw new AppError('Error fetching tasks', 500);
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new AppError('Task not found', 404);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching task', 500);
    }
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    try {
      const { title, description, status = 'pending' } = taskData;
      const result = await pool.query(
        'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
        [title, description, status]
      );
      return result.rows[0];
    } catch (error) {
      throw new AppError('Error creating task', 500);
    }
  }

  async updateTask(id: number, taskData: UpdateTaskDTO): Promise<Task> {
    try {
      const { title, description, status } = taskData;
      const result = await pool.query(
        'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), updated_at = NOW() WHERE id = $4 RETURNING *',
        [title, description, status, id]
      );
      if (result.rows.length === 0) {
        throw new AppError('Task not found', 404);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating task', 500);
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        throw new AppError('Task not found', 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting task', 500);
    }
  }
} 