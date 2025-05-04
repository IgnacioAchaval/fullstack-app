// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.POSTGRES_DB = 'taskmanager_test';
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'postgres';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';

// Increase timeout for tests
jest.setTimeout(10000); 