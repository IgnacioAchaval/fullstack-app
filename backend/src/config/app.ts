import dotenv from 'dotenv';
import { CorsOptions } from 'cors';

// Load environment variables
dotenv.config();

// Default configuration
const defaultConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as string[],
    allowedHeaders: ['Content-Type', 'Authorization'] as string[],
  } as CorsOptions,
  database: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'taskmanager',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Export configuration
export const config = defaultConfig;

// Type for the config object
export type Config = typeof config;

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('Current configuration:', {
    env: config.env,
    port: config.port,
    cors: config.cors,
    database: {
      ...config.database,
      password: '***',
    },
  });
}

export default config; 