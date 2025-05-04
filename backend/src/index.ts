import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { taskRoutes } from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import config from './config/app';
import './config/database'; // Initialize database connection

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3001;

// Apply middleware
app.use(cors(config.cors));
app.use(express.json());

// Apply routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Apply error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} 