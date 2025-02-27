// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const DB_CONFIG = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydatabase",
  password: process.env.DB_PASS || "postgres",
  port: process.env.DB_PORT || 5432,
};

console.log("Database Config:", DB_CONFIG); // For debugging

const pool = new (require("pg").Pool)(DB_CONFIG);

// Example routes:
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

app.get("/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    res.json({ message: "Usuario agregado" });
  } catch (error) {
    console.error("Database insert error:", error.message);
    res.status(500).json({ error: "Failed to insert user" });
  }
});

// Export ONLY the Express "app" instance (no .listen())
module.exports = app;