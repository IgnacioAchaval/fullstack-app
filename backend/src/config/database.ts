import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import config from './app';

// Load environment variables
dotenv.config();

// Configure PostgreSQL pool
const dbConfig: PoolConfig = {
  user: process.env.DB_USER || config.database.user,
  host: process.env.DB_HOST || config.database.host,
  database: process.env.DB_NAME || config.database.name,
  password: process.env.DB_PASSWORD || config.database.password,
  port: parseInt(process.env.DB_PORT || config.database.port.toString()),
};

const pool = new Pool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(-1);
  }
};

// Only test connection if not in test environment
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

export { pool }; 