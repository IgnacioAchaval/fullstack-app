import { jest, beforeAll, afterAll } from '@jest/globals';
import { pool } from '../config/database';
import type { Pool } from 'pg';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_NAME = 'taskmanager_test';

// Create tables for integration tests
beforeAll(async () => {
  const pgPool = pool as Pool;
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create an index on the completed column for faster queries
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

    -- Create a trigger to automatically update the updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `);
});

// Clean up after all tests
afterAll(async () => {
  const pgPool = pool as Pool;
  await pgPool.query('DROP TABLE IF EXISTS tasks CASCADE');
  await pgPool.end();
}); 