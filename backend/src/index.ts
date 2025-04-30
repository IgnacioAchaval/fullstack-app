import express, { Express } from 'express';
import cors from 'cors';
import { taskRoutes } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import config from './config/app';
import './config/database'; // Initialize database connection

// Create Express application
const app: Express = express();

// Apply middleware
app.use(cors(config.cors));
app.use(express.json());

// Apply routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server if not in test environment
if (config.env !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server is running in ${config.env} mode on port ${config.port}`);
  });
}

export { app }; 