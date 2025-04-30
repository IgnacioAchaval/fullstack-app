/// <reference types="jest" />

import { TaskService } from '../../services/taskService';
import { Task } from '../../types/database';
import { ApiError } from '../../middleware/errorHandler';

// Mock the database pool
jest.mock('../../config/database', () => {
  const mockQuery = jest.fn();
  return {
    pool: {
      query: mockQuery
    }
  };
});

// Get the mocked pool
const { pool } = require('../../config/database');

describe('TaskService', () => {
  let taskService: TaskService;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  const mockTask: Task = {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    taskService = TaskService.getInstance();
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      pool.query.mockResolvedValueOnce({
        rows: mockTasks,
        rowCount: 2,
        command: '',
        oid: 0,
        fields: []
      });

      const tasks = await taskService.getTasks();
      expect(tasks).toEqual(mockTasks);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE 1=1 ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [10, 0]
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.getTasks()).rejects.toThrow('Error fetching tasks');
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [mockTask],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      });

      const task = await taskService.getTaskById(1);
      expect(task).toEqual(mockTask);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = $1', [1]);
    });

    it('should throw not found error if task not found', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: '',
        oid: 0,
        fields: []
      });

      await expect(taskService.getTaskById(999)).rejects.toThrow(
        new ApiError(404, 'Task not found')
      );
    });
  });
}); 