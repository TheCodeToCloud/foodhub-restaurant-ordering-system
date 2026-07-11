/**
 * server.js
 *
 * Entry point for the Restaurant Ordering System API.
 * Initializes Express 5, configures middleware (JSON, CORS),
 * verifies the MySQL connection pool, and starts the HTTP server.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

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

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing for all origins
// Restrict to your frontend origin in production, e.g.:
//   app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors());

// Serve the uploads directory statically so images can be accessed directly
const path = require("path");
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
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/users",      require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/foods",      require("./routes/foods"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/admin",      require("./routes/admin"));

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─── Global Error Handler (Express 5 style) ───────────────────────────────────

// Express 5 automatically forwards async errors; no need for try/catch wrappers.
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
    // Verify the database connection pool is reachable before accepting requests
    const connection = await pool.getConnection();
    console.log("✅  MySQL connection pool established successfully.");
    connection.release(); // Return the connection to the pool

    app.listen(PORT, () => {
      console.log(`🚀  Server is running on http://localhost:${PORT}`);
      console.log(`📋  Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌  Failed to connect to the database:", err.message);
    process.exit(1); // Exit so the process manager (e.g. PM2) can restart
  }
}

startServer();
