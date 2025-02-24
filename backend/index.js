require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Rutas API
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
  const { name, email } = req.body;
  await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
  res.json({ message: "Usuario agregado" });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:5000");
});
