import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Reconstruct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pool from "./database/db.js";

// ─── Route Imports ────────────────────────────────────────────────────────────
import authRouter       from "./router/auth.js";
import usersRouter      from "./router/users.js";
import categoriesRouter from "./router/categories.js";
import foodsRouter      from "./router/foods.js";
import ordersRouter     from "./router/orders.js";
import adminRouter      from "./router/admin.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Migration script removed to prevent startup crashes

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Manual Migration / Setup Route ────────────────────────────────────────────────
app.get("/api/migrate-db", async (req, res) => {
  const results = [];
  const errors = [];

  const queries = [
    `CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      profile_image LONGTEXT
    )`,
    `CREATE TABLE IF NOT EXISTS Categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(100) NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS Foods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      food_name VARCHAR(150) NOT NULL,
      category_id INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      ingredients TEXT,
      quantity INT NOT NULL DEFAULT 0,
      image LONGTEXT,
      FOREIGN KEY (category_id) REFERENCES Categories(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      food_id INT NOT NULL,
      quantity INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (food_id) REFERENCES Foods(id)
    )`,
    `CREATE TABLE IF NOT EXISTS Settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      store_name VARCHAR(150) DEFAULT 'FoodHub',
      contact_email VARCHAR(150) DEFAULT 'hello@foodhub.com',
      phone VARCHAR(50) DEFAULT '',
      is_open TINYINT(1) DEFAULT 1
    )`,
    `ALTER TABLE Users MODIFY profile_image LONGTEXT`,
    `ALTER TABLE Foods MODIFY image LONGTEXT`,
  ];

  for (const q of queries) {
    try {
      await pool.query(q);
      results.push({ ok: q.substring(0, 60) });
    } catch (err) {
      errors.push({ query: q.substring(0, 60), error: err.message });
    }
  }

  res.json({ message: "Migration done!", results, errors });
});


// ─── Health-check route ───────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "🍽️  Restaurant Ordering System API is running.",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",       authRouter);
app.use("/api/users",      usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/foods",      foodsRouter);
app.use("/api/orders",     ordersRouter);
app.use("/api/admin",      adminRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌  Unhandled error:", err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅  MySQL connection pool established successfully.");
    connection.release();
  } catch (err) {
    console.error("⚠️  Failed to connect to the database initially, but starting server anyway. Error:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀  Server is running on http://localhost:${PORT}`);
    console.log(`📋  Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();
