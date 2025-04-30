import request from 'supertest';
import { app } from '../../index';
import { Pool } from 'pg';
import { Task, QueryResultRow } from '../../types/database';

jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('Task E2E Tests', () => {
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    mockPool = new Pool() as jest.Mocked<Pool>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { text: 'Test Task' };
      const mockResponse: Task = {
        id: 1,
        text: 'Test Task',
        created_at: new Date()
      };

      const mockResult: QueryResultRow = {
        rows: [mockResponse],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };

      mockPool.query.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = { text: 'Updated Task' };
      const mockResponse: Task = {
        id: 1,
        text: 'Updated Task',
        created_at: new Date()
      };

      const mockResult: QueryResultRow = {
        rows: [mockResponse],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };

      mockPool.query.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const mockResult: QueryResultRow = {
        rows: [],
        rowCount: 1,
        command: '',
        oid: 0,
        fields: []
      };

      mockPool.query.mockResolvedValueOnce(mockResult);

      const response = await request(app)
        .delete('/api/tasks/1');

      expect(response.status).toBe(204);
    });
  });
}); 