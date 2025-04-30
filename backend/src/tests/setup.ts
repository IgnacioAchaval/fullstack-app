import dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Set default timeout for all tests
jest.setTimeout(10000);

// Mock console.error to keep test output clean
global.console.error = jest.fn(); 