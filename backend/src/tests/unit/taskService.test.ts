/// <reference types="jest" />

import { TaskService } from '../../services/taskService';
import { Pool } from 'pg';
import { AppError } from '../../middleware/errorHandler';
import { Task, QueryResultRow } from '../../types/database';

// Mock the pg Pool
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('TaskService', () => {
  let taskService: TaskService;
  let mockPool: Pool;

  const mockTasks: Task[] = [
    { id: 1, text: 'Task 1', created_at: new Date() },
    { id: 2, text: 'Task 2', created_at: new Date() }
  ];

  const mockTask: Task = { id: 1, text: 'Task 1', created_at: new Date() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool = new Pool();
    taskService = new TaskService();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockResult: QueryResultRow = {
        rows: mockTasks,
        rowCount: 2,
        command: '',
        oid: 0,
        fields: []
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const tasks = await taskService.getAllTasks();
      expect(tasks).toEqual(mockTasks);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM tasks ORDER BY created_at DESC');
    });

    it('should handle database errors', async () => {
      (mockPool.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.getAllTasks()).rejects.toThrow('Database error');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const mockResult: QueryResultRow = {
        rows: [mockTask],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const task = await taskService.getTaskById(1);
      expect(task).toEqual(mockTask);
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = $1', [1]);
    });

    it('should return null if task not found', async () => {
      const mockResult: QueryResultRow = {
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: []
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResult);

      const task = await taskService.getTaskById(999);
      expect(task).toBeNull();
    });
  });
}); 