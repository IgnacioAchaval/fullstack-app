import type { Config } from '@jest/types';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { jest } from '@jest/globals';

// Load environment variables from .env.test file if it exists
try {
  dotenv.config({ path: '.env.test' });
} catch (error) {
  // Set default test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3001';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/taskmanager_test';
}

// Set default timeout for all tests
jest.setTimeout(10000);

// Mock console.error to keep test output clean
global.console.error = jest.fn();

// Mock the pg Pool
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global cleanup here
});

// Reset all mocks before each test
global.beforeEach(() => {
  jest.clearAllMocks();
}); 