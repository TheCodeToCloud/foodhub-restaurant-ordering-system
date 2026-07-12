import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Reconstruct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  // Step 1 – Connect WITHOUT specifying a database so we can create it if needed
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const dbName = process.env.DB_NAME;

  try {
    // Step 2 – Ensure the database exists
    console.log(`\n🔧  Ensuring database "${dbName}" exists...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅  Database "${dbName}" is ready.`);

    // Step 3 – Switch to the target database
    await connection.query(`USE \`${dbName}\``);

    // Step 4 – Read and execute the SQL schema file
    const schemaPath = path.join(__dirname, "database", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // Split on semicolons to execute each statement individually
    const statements = schemaSql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`\n📦  Running schema migration (${statements.length} statements)...`);

    for (const stmt of statements) {
      await connection.query(stmt);
    }

    console.log("✅  All tables created / verified successfully.\n");
    console.log("Tables initialized:");
    console.log("  • Users");
    console.log("  • Categories");
    console.log("  • Foods");
    console.log("  • Orders\n");
  } finally {
    await connection.end();
  }
}

initializeDatabase().catch((err) => {
  console.error("❌  Database initialization failed:", err.message);
  process.exit(1);
});
