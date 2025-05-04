import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index';
import { pool } from '../../config/database';
import { Pool } from 'pg';

describe('Task API Integration Tests', () => {
  beforeAll(async () => {
    // Clean up the database before tests
    const pgPool = pool as Pool;
    await pgPool.query('DELETE FROM tasks');
  });

  afterAll(async () => {
    // Clean up after tests
    const pgPool = pool as Pool;
    await pgPool.query('DELETE FROM tasks');
    await pgPool.end();
  });

  it('should check API health', async () => {
    const response = await request(app).get('/api/tasks/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should perform CRUD operations on tasks', async () => {
    // Create a task
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description'
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.title).toBe('Test Task');
    const taskId = createResponse.body.data.id;

    // Get the task
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.title).toBe('Test Task');

    // Update the task
    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        completed: true
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.title).toBe('Updated Task');
    expect(updateResponse.body.data.completed).toBe(true);

    // Delete the task
    const deleteResponse = await request(app)
      .delete(`/api/tasks/${taskId}`);

    expect(deleteResponse.status).toBe(204);

    // Verify task is deleted
    const getDeletedResponse = await request(app)
      .get(`/api/tasks/${taskId}`);

    expect(getDeletedResponse.status).toBe(404);
  });
}); 