import request from 'supertest';
import { app } from '../../index';
import { Task } from '../../types/database';

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

describe('Task E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        completed: false
      };
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockTask],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      });

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Task created successfully',
        data: {
          ...mockTask,
          created_at: mockTask.created_at.toISOString(),
          updated_at: mockTask.updated_at.toISOString()
        }
      });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true
      };
      const mockTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockTask],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      });

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Task updated successfully',
        data: {
          ...mockTask,
          created_at: mockTask.created_at.toISOString(),
          updated_at: mockTask.updated_at.toISOString()
        }
      });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1 }],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      });

      const response = await request(app)
        .delete('/api/tasks/1');

      expect(response.status).toBe(204);
    });
  });
}); 