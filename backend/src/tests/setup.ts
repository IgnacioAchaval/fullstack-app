import { jest } from '@jest/globals';
import type { Pool, QueryResult } from 'pg';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_NAME = 'taskmanager_test';

// Create a type that includes both Pool's query method and Jest's mock methods
export type MockQueryFunction = jest.Mock & {
  mockResolvedValueOnce: (value: any) => jest.Mock;
  mockRejectedValueOnce: (value: any) => jest.Mock;
};

// Mock database
const mockPool = {
  query: jest.fn() as MockQueryFunction,
  connect: jest.fn(),
  end: jest.fn()
} as unknown as Pool;

jest.mock('../config/database', () => ({
  pool: mockPool
}));

export const mockQuery = mockPool.query;

// Global setup
beforeAll(() => {
  // Add any global setup here
});

// Global teardown
afterAll(async () => {
  // Ensure all mocks are cleared
  jest.clearAllMocks();
  
  // Ensure pool is ended
  await mockPool.end();
  
  // Force any remaining handles to close
  await new Promise(resolve => setTimeout(resolve, 100));
}); 