require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4173', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database connection retry mechanism
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

async function connectWithRetry(retries = MAX_RETRIES) {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database models
    await sequelize.sync();
    console.log('Database models synchronized successfully.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (retries > 0) {
      console.log(`Database connection failed. Retrying in ${RETRY_INTERVAL/1000} seconds... (${retries} attempts remaining)`);
      setTimeout(() => connectWithRetry(retries - 1), RETRY_INTERVAL);
    } else {
      console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}
}

// Start the application
connectWithRetry();

module.exports = app; 