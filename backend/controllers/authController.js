import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";

// POST /api/auth/register
export const register = async (req, res) => {
  let { fullname, email, password, phone = null, address = null, role = "customer" } = req.body;

  if (email === 'admin@foodhub.com') {
    role = 'admin';
  }

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: "fullname, email, and password are required." });
  }

  const [existing] = await pool.query("SELECT id FROM Users WHERE email = ?", [email]);
  if (existing.length > 0) {
    return res.status(409).json({ error: "Email is already registered." });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [result] = await pool.query(
    `INSERT INTO Users (fullname, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)`,
    [fullname, email, hashedPassword, phone, address, role]
  );

  const userId = result.insertId;
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

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const [rows] = await pool.query(
    "SELECT id, fullname, email, password, role FROM Users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
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

    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

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
