import express from 'express';
import cors from 'cors';
import { taskRouter } from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import config from './config/app.js';
import './config/database'; // Initialize database connection

// Create Express application
const app = express();

// Apply middleware
app.use(cors(config.cors));
app.use(express.json());

// Apply routes
app.use('/api/tasks', taskRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

export { app }; 