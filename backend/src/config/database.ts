import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import config from './app.js';

// Load environment variables
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const dbConfig: PoolConfig = {
  user: config.database.user,
  host: config.database.host,
  database: config.database.name,
  password: config.database.password,
  port: config.database.port,
};

// Create a singleton pool instance
export const pool = new Pool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    // Don't exit in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(-1);
    }
  }
};

// Only test connection if not in test environment
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

export default pool; 