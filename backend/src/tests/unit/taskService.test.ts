/// <reference types="jest" />

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TaskService } from '../../services/taskService';
import { mockQuery } from '../setup';
import type { MockQueryFunction } from '../setup';
import { pool } from '../../config/database';
import { Pool } from 'pg';

describe('TaskService', () => {
  let taskService: TaskService;
  let pgPool: Pool;
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
    pgPool = pool as Pool;
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

  it('should get all tasks', async () => {
    const tasks = await taskService.getTasks();
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should get a task by id', async () => {
    // First create a task
    const task = await taskService.createTask({
      title: 'Test Task',
      description: 'Test Description'
    });

    // Then get it by id
    const result = await taskService.getTaskById(task.id);
    expect(result.id).toBe(task.id);
    expect(result.title).toBe(task.title);
  });

  it('should update a task', async () => {
    // First create a task
    const task = await taskService.createTask({
      title: 'Test Task',
      description: 'Test Description'
    });

    // Then update it
    const updatedTask = await taskService.updateTask(task.id, {
      title: 'Updated Task',
      completed: true
    });

    expect(updatedTask.title).toBe('Updated Task');
    expect(updatedTask.completed).toBe(true);
  });

  it('should delete a task', async () => {
    // First create a task
    const task = await taskService.createTask({
      title: 'Test Task',
      description: 'Test Description'
    });

    // Then delete it
    await taskService.deleteTask(task.id);

    // Verify it's deleted
    await expect(taskService.getTaskById(task.id)).rejects.toThrow('Task not found');
  });
}); 