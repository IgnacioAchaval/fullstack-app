// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Database configuration with defaults
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mydatabase',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  // Add connection pooling settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// In non-test mode ensure DB connectivity
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(client => {
      client.release();
      console.log('Database connected successfully');
    })
    .catch(err => {
      console.error('Database connection failed:', err);
      process.exit(1);
    });
}

// Health-check endpoint
app.get('/', (req, res) => {
  res.send('Backend is running! 🚀');
});

// Users listing
app.get('/users', async (req, res) => {
  let client;
  try {
    if (process.env.NODE_ENV === 'test') {
    const { rows } = await pool.query('SELECT * FROM users');
      return res.json(rows);
    }
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM users');
    res.json(rows);
  } catch (e) {
    console.error('Database error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (client) client.release();
  }
});

// Create user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  let client;
  try {
    if (process.env.NODE_ENV === 'test') {
    await pool.query('INSERT INTO users(name,email) VALUES($1,$2)', [name, email]);
      return res.json({ message: 'Usuario agregado' });
    }
    client = await pool.connect();
    await client.query('INSERT INTO users(name,email) VALUES($1,$2)', [name, email]);
    res.json({ message: 'Usuario agregado' });
  } catch (e) {
    console.error('Database insert error:', e.message);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (client) client.release();
  }
});

// Export app for server or tests
module.exports = app;
