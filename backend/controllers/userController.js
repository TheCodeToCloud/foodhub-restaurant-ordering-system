import pool from "../database/db.js";
import path from "path";
import bcrypt from "bcryptjs";

// GET /api/users
export const getAllUsers = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, address, role FROM Users ORDER BY id DESC"
  );
  return res.status(200).json(rows);
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    throw err;
  }
};

// GET /api/users/profile
export const getProfile = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, fullname, email, phone, address, role, profile_image FROM Users WHERE id = ?",
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "User not found." });
  return res.status(200).json(rows[0]);
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const { fullname, phone, address } = req.body;
  let profileImage = null;

  if (req.file) {
    const base64Image = req.file.buffer.toString("base64");
    profileImage = `data:${req.file.mimetype};base64,${base64Image}`;
  }

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

// PUT /api/users/password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required." });
  }

  const [rows] = await pool.query("SELECT password FROM Users WHERE id = ?", [req.user.id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found." });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect current password." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await pool.query("UPDATE Users SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);

  return res.status(200).json({ message: "Password updated successfully." });
};
