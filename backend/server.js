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

// Run database migrations on startup
(async () => {
  try {
    console.log("Running database migrations...");
    await pool.query("ALTER TABLE Users MODIFY profile_image LONGTEXT");
    await pool.query("ALTER TABLE Foods MODIFY image LONGTEXT");
    console.log("Migrations completed successfully.");
  } catch (err) {
    console.error("Migration error (might be already applied or ignored):", err.message);
  }
})();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

    app.listen(PORT, () => {
      console.log(`🚀  Server is running on http://localhost:${PORT}`);
      console.log(`📋  Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌  Failed to connect to the database:", err.message);
    process.exit(1);
  }
}

startServer();
