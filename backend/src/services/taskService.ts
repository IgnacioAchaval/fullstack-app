import { pool } from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { Task, TaskQueryParams } from '../types';

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getTasks(queryParams?: TaskQueryParams): Promise<Task[]> {
    try {
      let query = 'SELECT * FROM tasks';
      const values: any[] = [];
      const conditions: string[] = [];

      if (queryParams) {
        if (queryParams.completed !== undefined) {
          conditions.push(`completed = $${values.length + 1}`);
          values.push(queryParams.completed);
        }

        if (queryParams.search) {
          conditions.push(`(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 1})`);
          values.push(`%${queryParams.search}%`);
        }

        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        if (queryParams.limit) {
          query += ` LIMIT $${values.length + 1}`;
          values.push(queryParams.limit);
        }

        if (queryParams.page && queryParams.limit) {
          query += ` OFFSET $${values.length + 1}`;
          values.push((queryParams.page - 1) * queryParams.limit);
        }
      }

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
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
      throw new ApiError(500, 'Error fetching task');
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    try {
      const { title, description, completed } = taskData;
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        [title, description, completed]
      );
      return result.rows[0];
    } catch (error) {
      throw new ApiError(500, 'Error creating task');
    }
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    try {
      const { title, description, completed } = taskData;
      const result = await pool.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed)
         WHERE id = $4
         RETURNING *`,
        [title, description, completed, id]
      );
      if (result.rows.length === 0) {
        throw new ApiError(404, 'Task not found');
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error updating task');
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        throw new ApiError(404, 'Task not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting task');
    }
  }
} 