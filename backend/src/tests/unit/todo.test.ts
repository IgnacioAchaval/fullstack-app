import request from 'supertest';
import express from 'express';
import { Pool } from 'pg';

// Mock the pg Pool
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Todo API', () => {
  let app: express.Application;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockPool = new Pool() as jest.Mocked<Pool>;

    // Add routes
    app.get('/api/todos', async (req, res) => {
      try {
        const result = await mockPool.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
      }
    });
  });

  it('should return all todos', async () => {
    const mockTodos = [
      { id: 1, text: 'Test todo 1', created_at: new Date() },
      { id: 2, text: 'Test todo 2', created_at: new Date() },
    ];

    mockPool.query.mockResolvedValueOnce({ rows: mockTodos, rowCount: 2 } as any);

    const response = await request(app).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTodos);
  });
}); 