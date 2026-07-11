/**
 * controllers/adminController.js
 *
 * Special endpoints for the Admin Dashboard.
 */

const pool = require("../config/db");

// ─── GET /api/admin/dashboard-stats ───────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // Run multiple queries concurrently for better performance
    const [
      [foodRows],
      [customerRows],
      [orderRows],
      [categoryRows],
      [revenueRows],
      [todayOrdersRows],
      [recentOrdersRows],
      [recentCustomersRows],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM Foods"),
      pool.query("SELECT COUNT(*) as count FROM Users WHERE role = 'customer'"),
      pool.query("SELECT COUNT(*) as count FROM Orders"),
      pool.query("SELECT COUNT(*) as count FROM Categories"),
      pool.query("SELECT SUM(total_price) as total FROM Orders WHERE status = 'Delivered'"),
      pool.query("SELECT COUNT(*) as count FROM Orders WHERE DATE(order_date) = CURDATE()"),
      pool.query(`
        SELECT o.id, o.status, o.total_price, o.order_date, u.fullname as customer_name, f.food_name 
        FROM Orders o 
        JOIN Users u ON o.user_id = u.id 
        JOIN Foods f ON o.food_id = f.id 
        ORDER BY o.order_date DESC LIMIT 5
      `),
      pool.query("SELECT id, fullname, email, profile_image FROM Users WHERE role = 'customer' ORDER BY id DESC LIMIT 5"),
    ]);

    const stats = {
      totalFoods: foodRows[0].count,
      totalCustomers: customerRows[0].count,
      totalOrders: orderRows[0].count,
      totalCategories: categoryRows[0].count,
      totalRevenue: revenueRows[0].total || 0,
      todayOrders: todayOrdersRows[0].count,
      recentOrders: recentOrdersRows,
      recentCustomers: recentCustomersRows,
    };

    return res.status(200).json(stats);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getDashboardStats,
};
