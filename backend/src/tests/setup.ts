import { jest } from '@jest/globals';
import { Task } from '../types';

// Mock query result type
export type MockQueryResult = {
  rows: Task[];
};

// Mock query function
export const mockQuery: jest.Mock = jest.fn();

// Mock the database pool
jest.mock('../config/database', () => ({
  pool: {
    query: mockQuery
  }
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_NAME = 'taskmanager_test'; 