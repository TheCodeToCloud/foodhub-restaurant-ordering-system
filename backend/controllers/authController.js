/**
 * controllers/authController.js
 *
 * Handles user registration and login logic.
 * All DB interactions use raw MySQL queries via the promise pool.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * Body: { fullname, email, password, phone?, address?, role? }
 * - Rejects duplicate emails (UNIQUE constraint + pre-check for a clearer error)
 * - Hashes the password with bcrypt (salt rounds = 10)
 * - Inserts the new user; role defaults to 'customer'
 * - Returns a signed JWT so the client is immediately logged in after registering
 */
const register = async (req, res) => {
  let {
    fullname,
    email,
    password,
    phone = null,
    address = null,
    role = "customer",
  } = req.body;

  // Auto-assign admin role for the default admin email
  if (email === 'admin@foodhub.com') {
    role = 'admin';
  }

  // ── Basic validation ──────────────────────────────────────────────────────
  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "fullname, email, and password are required." });
  }

  // ── Check for existing email ──────────────────────────────────────────────
  const [existing] = await pool.query(
    "SELECT id FROM Users WHERE email = ?",
    [email]
  );
  if (existing.length > 0) {
    return res.status(409).json({ error: "Email is already registered." });
  }

  // ── Hash password ─────────────────────────────────────────────────────────
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // ── Insert user ───────────────────────────────────────────────────────────
  const [result] = await pool.query(
    `INSERT INTO Users (fullname, email, password, phone, address, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, email, hashedPassword, phone, address, role]
  );

  const userId = result.insertId;

  // ── Sign JWT ──────────────────────────────────────────────────────────────
  const token = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(201).json({
    message: "User registered successfully.",
    token,
    user: { id: userId, fullname, email, role },
  });
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 * - Looks up user by email
 * - Compares plain-text password against the stored bcrypt hash
 * - Returns a signed JWT on success
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // ── Basic validation ──────────────────────────────────────────────────────
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  // ── Find user ─────────────────────────────────────────────────────────────
  const [rows] = await pool.query(
    "SELECT id, fullname, email, password, role FROM Users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    // ── Auto-seed Admin if it's the admin email ──────────────────────────────
    if (email === 'admin@foodhub.com' && password === 'admin@123') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        `INSERT INTO Users (fullname, email, password, role) VALUES (?, ?, ?, ?)`,
        ['FoodHub Admin', email, hashedPassword, 'admin']
      );
      
      const token = jwt.sign(
        { id: result.insertId, email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      return res.status(200).json({
        message: "Admin seeded and logged in.",
        token,
        user: { id: result.insertId, fullname: 'FoodHub Admin', email, role: 'admin' },
      });
    }

    // Generic message to avoid user-enumeration
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = rows[0];

  // ── Compare password ──────────────────────────────────────────────────────
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // ── Sign JWT ──────────────────────────────────────────────────────────────
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return res.status(200).json({
    message: "Login successful.",
    token,
    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { register, login };
