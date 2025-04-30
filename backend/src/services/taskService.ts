import { pool } from '../config/database';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskQueryParams, DatabaseError } from '../types';
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

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    try {
      const { title, description, completed = false } = taskData;
      const result = await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        [title, description, completed]
      );
      return result.rows[0];
    } catch (error) {
      const dbError = error as DatabaseError;
      if (dbError.code === '23505') { // Unique violation
        throw new ApiError(409, 'Task with this title already exists');
      }
      throw new ApiError(500, 'Error creating task');
    }
  }

  async getTasks(params: TaskQueryParams = {}): Promise<Task[]> {
    try {
      const { completed, search, page = 1, limit = 10 } = params;
      const offset = (page - 1) * limit;
      
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const values: any[] = [];
      let paramCount = 1;

      if (completed !== undefined) {
        query += ` AND completed = $${paramCount}`;
        values.push(completed);
        paramCount++;
      }

      if (search) {
        query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        values.push(`%${search}%`);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, offset);

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

  async updateTask(id: number, taskData: UpdateTaskDTO): Promise<Task> {
    try {
      const { title, description, completed } = taskData;
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(description);
        paramCount++;
      }

      if (completed !== undefined) {
        updates.push(`completed = $${paramCount}`);
        values.push(completed);
        paramCount++;
      }

      if (updates.length === 0) {
        throw new ApiError(400, 'No update data provided');
      }

      values.push(id);
      const query = `
        UPDATE tasks 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramCount} 
        RETURNING *
      `;

      const result = await pool.query(query, values);
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
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        throw new ApiError(404, 'Task not found');
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Error deleting task');
    }
  }
} 