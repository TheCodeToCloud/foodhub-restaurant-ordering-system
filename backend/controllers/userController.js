/**
 * controllers/userController.js
 *
 * User management endpoints for Admin.
 */

const pool = require("../config/db");

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

module.exports = {
  getAllUsers,
  deleteUser,
};
