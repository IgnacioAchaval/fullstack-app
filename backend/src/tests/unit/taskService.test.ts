/// <reference types="jest" />

import { TaskService } from '../../services/taskService';
import { Task } from '../../types/database';
import { ApiError } from '../../middleware/errorHandler';
import { pool } from '../../config/database';

// Mock the database pool
jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('TaskService', () => {
  let taskService: TaskService;
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    taskService = TaskService.getInstance();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      });

      expect(result).toEqual(mockTask);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        ['Test Task', 'Test Description', false]
      );
    });

    it('should throw an error if task creation fails', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      })).rejects.toThrow(ApiError);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks when no filters are provided', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTasks();

      expect(result).toEqual([mockTask]);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM tasks'),
        expect.any(Array)
      );
    });

    it('should filter tasks by completion status', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTasks({ completed: true });

      expect(result).toEqual([mockTask]);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('completed = $1'),
        expect.arrayContaining([true])
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(mockTask);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        [1]
      );
    });

    it('should throw an error if task is not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.getTaskById(1)).rejects.toThrow(ApiError);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedTask] });

      const result = await taskService.updateTask(1, { title: 'Updated Task' });

      expect(result).toEqual(updatedTask);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks'),
        expect.arrayContaining(['Updated Task', 1])
      );
    });

    it('should throw an error if task is not found during update', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.updateTask(1, { title: 'Updated Task' }))
        .rejects.toThrow(ApiError);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      await taskService.deleteTask(1);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1 RETURNING id',
        [1]
      );
    });

    it('should throw an error if task is not found during deletion', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.deleteTask(1)).rejects.toThrow(ApiError);
    });
  });
}); 