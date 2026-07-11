/**
 * controllers/userController.js
 *
 * User management endpoints for Admin.
 */

const pool = require("../config/db");
const path = require("path");
const bcrypt = require("bcryptjs");

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Admin views all registered customers
const getAllUsers = async (req, res) => {
  // Select safely: never return passwords
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, address, role FROM Users ORDER BY id DESC"
  );
  return res.status(200).json(rows);
};

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
// Admin removes a user account
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    // If the user has orders, we might hit a foreign key constraint depending on ON DELETE CASCADE/RESTRICT
    // Our schema used ON DELETE CASCADE for orders_user, so deleting a user also deletes their orders.
    throw err;
  }
};

// ─── GET /api/users/profile ──────────────────────────────────────────────────
// Logged-in user fetches their own profile
const getProfile = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, address, role, profile_image FROM Users WHERE id = ?",
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "User not found." });
  return res.status(200).json(rows[0]);
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
// Logged-in user updates their own profile & profile picture
const updateProfile = async (req, res) => {
  const { fullname, phone, address } = req.body;
  const profileImage = req.file ? `uploads/${req.file.filename}` : null;

  let query, params;
  if (profileImage) {
    query = "UPDATE Users SET fullname = ?, phone = ?, address = ?, profile_image = ? WHERE id = ?";
    params = [fullname, phone, address, profileImage, req.user.id];
  } else {
    query = "UPDATE Users SET fullname = ?, phone = ?, address = ? WHERE id = ?";
    params = [fullname, phone, address, req.user.id];
  }

  await pool.query(query, params);
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, address, role, profile_image FROM Users WHERE id = ?",
    [req.user.id]
  );
  return res.status(200).json({ message: "Profile updated successfully.", user: rows[0] });
};

// ─── PUT /api/users/password ──────────────────────────────────────────────────
// Logged-in user updates their password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }

  // 1. Fetch user to get current hashed password
  const [rows] = await pool.query("SELECT password FROM Users WHERE id = ?", [req.user.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  const user = rows[0];

  // 2. Compare current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect current password." });
  }

  // 3. Hash new password and update
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await pool.query("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);

  return res.status(200).json({ message: "Password updated successfully." });
};

module.exports = {
  getAllUsers,
  deleteUser,
  getProfile,
  updateProfile,
  updatePassword,
};
