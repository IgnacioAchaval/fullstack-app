import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

// Set default test environment variables
process.env.PORT = '3001';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.DB_NAME = 'taskmanager_test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';

// Mock the database
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }
}));

// Export the mock query function for use in tests
export const { query: mockQuery } = jest.requireMock('../config/database').pool; 