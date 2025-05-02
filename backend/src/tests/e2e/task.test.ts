/// <reference types="jest" />
import request from 'supertest';
import { app } from '../../index';
import { Pool } from 'pg';
import { Task } from '../../types';

// Mock the database pool
jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

import { pool } from '../../config/database';

describe('Task API Endpoints', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful query responses
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.completed).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Test Description' })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockTasks });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('completed');
    });

    it('should filter tasks by completion status', async () => {
      const completedTask = { ...mockTask, completed: true };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [completedTask] });

      const response = await request(app)
        .get('/api/tasks?completed=true')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .get('/api/tasks/1')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(mockTask.id);
      expect(response.body.data.title).toBe(mockTask.title);
      expect(response.body.data.description).toBe(mockTask.description);
    });

    it('should return 404 if task is not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .put('/api/tasks/1')
        .send({ title: 'Updated Task' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Updated Task');
    });

    it('should return 404 if task is not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Updated Task' })
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .delete('/api/tasks/1')
        .expect(204);

      // Verify task is deleted
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const getResponse = await request(app)
        .get('/api/tasks/1')
        .expect(404);

      expect(getResponse.body.status).toBe('error');
      expect(getResponse.body.message).toContain('Task not found');
    });

    it('should return 404 if task is not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .delete('/api/tasks/999')
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Task not found');
    });
  });
}); 