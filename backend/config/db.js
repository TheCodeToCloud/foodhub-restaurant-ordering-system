const mysql = require("mysql2");
require("dotenv").config();

/**
 * Creates a MySQL connection pool using credentials from environment variables.
 * Using a pool improves performance by reusing connections for multiple queries
 * rather than opening/closing a new connection on each request.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based version of the pool so we can use async/await
module.exports = pool.promise();
