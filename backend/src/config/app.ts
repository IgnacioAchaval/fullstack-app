import dotenv from 'dotenv';
import { CorsOptions } from 'cors';

// Load environment variables
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

// Default configuration
const defaultConfig = {
  env: 'development',
  port: 3001,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as string[],
    allowedHeaders: ['Content-Type', 'Authorization'] as string[],
  } as CorsOptions,
  database: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'taskmanager',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Environment-specific configuration
const envConfig = {
  development: {
    ...defaultConfig,
    env: 'development',
  },
  test: {
    ...defaultConfig,
    env: 'test',
    port: 3001,
    database: {
      ...defaultConfig.database,
      name: process.env.DB_NAME || 'taskmanager_test',
    },
  },
  production: {
    ...defaultConfig,
    env: 'production',
  },
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Export configuration
export const config = {
  ...envConfig[currentEnv as keyof typeof envConfig],
  port: parseInt(process.env.PORT || String(envConfig[currentEnv as keyof typeof envConfig].port), 10),
  cors: {
    ...envConfig[currentEnv as keyof typeof envConfig].cors,
    origin: process.env.CORS_ORIGIN || envConfig[currentEnv as keyof typeof envConfig].cors.origin,
  },
} as const;

// Type for the config object
export type Config = typeof config;

// Log configuration in development
if (currentEnv === 'development') {
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

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV', 'PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'DB_PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in environment variables`);
  }
}

export default config; 