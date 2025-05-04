/// <reference types="jest" />

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TaskService } from '../../services/taskService';
import { mockQuery, MockQueryResult } from '../setup';
import { pool } from '../../config/database';
import { Pool } from 'pg';
import { ApiError } from '../../middleware/errorHandler';
import { Task } from '../../types';

// Mock the database pool
jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('TaskService', () => {
  let taskService: TaskService;
  let pgPool: Pool;
  const now = new Date();
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: now,
    updated_at: now
  };

  beforeEach(() => {
    taskService = TaskService.getInstance();
    pgPool = pool as Pool;
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false
      };

      const mockResult: MockQueryResult = {
        rows: [{
          id: 1,
          ...taskData,
          created_at: now,
          updated_at: now
        }]
      };

      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.createTask(taskData);

      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        [taskData.title, taskData.description, taskData.completed]
      );
      expect(result).toEqual(mockTask);
    });

    it('should throw ApiError when database query fails', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false
      };

      (mockQuery as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.createTask(taskData)).rejects.toThrow(ApiError);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          created_at: now,
          updated_at: now
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          created_at: now,
          updated_at: now
        }
      ];

      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: mockTasks });

      const result = await taskService.getTasks();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should throw ApiError when database query fails', async () => {
      (mockQuery as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.getTasks()).rejects.toThrow(ApiError);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTaskById(1);

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = $1', [1]);
      expect(result).toEqual(mockTask);
    });

    it('should throw ApiError when task is not found', async () => {
      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.getTaskById(1)).rejects.toThrow(ApiError);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };

      const updatedTask = {
        ...mockTask,
        ...taskData
      };

      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [updatedTask] });

      const result = await taskService.updateTask(1, taskData);

      expect(mockQuery).toHaveBeenCalledWith(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed)
         WHERE id = $4
         RETURNING *`,
        [taskData.title, taskData.description, taskData.completed, 1]
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw ApiError when task is not found', async () => {
      const taskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };

      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.updateTask(1, taskData)).rejects.toThrow(ApiError);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      await taskService.deleteTask(1);

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM tasks WHERE id = $1 RETURNING *', [1]);
    });

    it('should throw ApiError when task is not found', async () => {
      (mockQuery as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.deleteTask(1)).rejects.toThrow(ApiError);
    });
  });
}); 