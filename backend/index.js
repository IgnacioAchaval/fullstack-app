require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const DB_CONFIG = {
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost", // Ensure localhost works for GH Actions
  database: process.env.DB_NAME || "mydatabase",
  password: process.env.DB_PASS || "postgres",
  port: process.env.DB_PORT || 5432,
};

console.log("Database Config:", DB_CONFIG);

const pool = new Pool(DB_CONFIG);

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

// Start server only if it's not running tests
const server = process.env.NODE_ENV !== "test"
  ? app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on http://0.0.0.0:${PORT}`);
    })
  : null;

// Always export both app and server (server may be null in test mode)
module.exports = { app, server };