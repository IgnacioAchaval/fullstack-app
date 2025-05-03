/// <reference types="jest" />

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TaskService } from '../../services/taskService';
import { mockQuery } from '../setup';

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
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      });

      expect(result).toEqual(mockTask);
      expect(mockQuery).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
        ['Test Task', 'Test Description', false]
      );
    });

    it('should throw an error if task creation fails', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      })).rejects.toThrow();
    });
  });

  describe('getTasks', () => {
    it('should return all tasks when no filters are provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTasks();

      expect(result).toEqual([mockTask]);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM tasks'),
        expect.any(Array)
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(mockTask);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        [1]
      );
    });

    it('should throw an error if task is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await expect(taskService.getTaskById(1)).rejects.toThrow();
    });
  });
}); 