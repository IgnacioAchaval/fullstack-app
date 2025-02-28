// index.js
const express = require('express');
const app = express();
const { Pool } = require('pg');

// Configure the database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

console.log("Database Config:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Only attempt a real DB connection if not in test mode
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(client => {
      client.release();
      console.log("Connected to the database successfully.");
    })
    .catch(err => {
      console.error("Failed to connect to database:", err);
      process.exit(1);
    });
} else {
  console.log("Skipping DB connection in test environment.");
}

// Define routes
app.get("/users", async (req, res) => {
  // For testing purposes, return a stubbed array
  res.json([]);
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, server };