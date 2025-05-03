import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_NAME = 'taskmanager_test';

// Mock database
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

export const { query: mockQuery } = jest.requireMock('../config/database').pool; 