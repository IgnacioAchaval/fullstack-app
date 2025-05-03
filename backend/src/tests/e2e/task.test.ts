/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index';
import { mockQuery } from '../setup';

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
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.description).toBe('Test Description');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Test Description' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Test Task');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

      const response = await request(app)
        .get('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Test Task');
    });

    it('should return 404 if task is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/tasks/999');

      expect(response.status).toBe(404);
    });
  });
}); 