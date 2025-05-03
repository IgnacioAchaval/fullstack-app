/// <reference types="jest" />

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TaskService } from '../../services/taskService';
import { mockQuery } from '../setup';
import type { MockQueryFunction } from '../setup';

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
    it('should create a new task', async () => {
      (mockQuery as MockQueryFunction).mockResolvedValueOnce({ rows: [mockTask] });
      const result = await taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task creation fails', async () => {
      (mockQuery as MockQueryFunction).mockRejectedValueOnce(new Error('Database error'));

      await expect(taskService.createTask({
        title: 'Test Task',
        description: 'Test Description'
      })).rejects.toThrow();
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      (mockQuery as MockQueryFunction).mockResolvedValueOnce({ rows: [mockTask] });
      const result = await taskService.getTasks();
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      (mockQuery as MockQueryFunction).mockResolvedValueOnce({ rows: [mockTask] });
      const result = await taskService.getTaskById(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error if task is not found', async () => {
      (mockQuery as MockQueryFunction).mockResolvedValueOnce({ rows: [] });

      await expect(taskService.getTaskById(1)).rejects.toThrow();
    });
  });
}); 