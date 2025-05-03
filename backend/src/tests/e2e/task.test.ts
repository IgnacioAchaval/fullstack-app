/// <reference types="jest" />
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index.js';
import { mockQuery } from '../setup.js';

describe('Task API', () => {
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

  it('should create and retrieve a task', async () => {
    // Create task
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description'
      });
    expect(createResponse.status).toBe(201);

    // Get task
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });
    const getResponse = await request(app)
      .get('/api/tasks/1');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.title).toBe('Test Task');
  });

  it('should list all tasks', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });
    const response = await request(app)
      .get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
}); 