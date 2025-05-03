import type { Config } from '@jest/types';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

// Load environment variables from .env.test file if it exists
try {
  dotenv.config({ path: '.env.test' });
} catch (error) {
  // Ignore error if file doesn't exist
}

// Set default test environment variables
const defaultEnvVars = {
  PORT: '3001',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'taskmanager_test',
  DB_HOST: 'localhost',
  DB_PORT: '5432'
};

// Set environment variables if they're not already set
Object.entries(defaultEnvVars).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

// Set default timeout for all tests
jest.setTimeout(10000);

// Mock console.error to keep test output clean
global.console.error = jest.fn();

// Create consistent mock functions
const mockQuery = jest.fn();
const mockConnect = jest.fn();
const mockEnd = jest.fn();

// Mock the pg Pool
jest.mock('pg', () => {
  const mockPool = {
    query: mockQuery,
    connect: mockConnect,
    end: mockEnd,
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

// Export mock functions for use in tests
export { mockQuery, mockConnect, mockEnd };

// Global test setup
beforeAll(async () => {
  // Reset all mocks
  jest.clearAllMocks();
});

// Global test teardown
afterAll(async () => {
  // Clean up any resources
  jest.clearAllMocks();
});

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  // Reset mock implementations to default
  mockQuery.mockReset();
  mockConnect.mockReset();
  mockEnd.mockReset();
}); 