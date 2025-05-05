const request = require('supertest');
const { describe, it, expect } = require('@jest/globals');
const app = require('../../index');

describe('Tasks API Integration Tests', () => {
  describe('GET /api/tasks', () => {
    it('should return an empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });
  });
}); 