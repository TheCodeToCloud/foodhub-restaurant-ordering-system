import pool from "../database/db.js";

// POST /api/orders
export const placeOrder = async (req, res) => {
  const { food_id, quantity, total_price } = req.body;
  const user_id = req.user.id;

  if (!food_id || !quantity || !total_price) {
    return res.status(400).json({ error: "food_id, quantity, and total_price are required." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Orders (user_id, food_id, quantity, total_price, status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [user_id, food_id, quantity, total_price]
    );

    return res.status(201).json({
      message: "Order placed successfully.",
      order_id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid food_id. Food item does not exist." });
    }
    throw err;
  }
};

// GET /api/orders
export const getOrders = async (req, res) => {
  const { id: user_id, role } = req.user;

  let query = `
    SELECT 
      o.id, o.quantity, o.total_price, o.order_date, o.status,
      u.fullname AS customer_name, u.email AS customer_email, u.phone AS customer_phone, u.address AS customer_address,
      f.food_name, f.image AS food_image, f.price AS unit_price
    FROM Orders o
    JOIN Users u ON o.user_id = u.id
    JOIN Foods f ON o.food_id = f.id
  `;
  const queryParams = [];

  if (role !== "admin") {
    query += ` WHERE o.user_id = ?`;
    queryParams.push(user_id);
  }

  query += ` ORDER BY o.order_date DESC`;

  const [rows] = await pool.query(query, queryParams);
  return res.status(200).json(rows);
};

// PUT /api/orders/:id
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { id: user_id, role } = req.user;

  if (!status) {
    return res.status(400).json({ error: "status is required." });
  }

  const validStatuses = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const [orders] = await pool.query("SELECT user_id, status FROM Orders WHERE id = ?", [id]);
  if (orders.length === 0) {
    return res.status(404).json({ error: "Order not found." });
  }

  const order = orders[0];

  if (role !== "admin") {
    if (order.user_id !== user_id) {
      return res.status(403).json({ error: "You do not have permission to modify this order." });
    }
    if (status !== "Cancelled") {
      return res.status(403).json({ error: "Customers can only cancel orders." });
    }
    if (order.status !== "Pending") {
      return res.status(400).json({ error: "Cannot cancel order that is no longer pending." });
    }
  }

  await pool.query("UPDATE Orders SET status = ? WHERE id = ?", [status, id]);

  return res.status(200).json({
    message: "Order status updated successfully.",
    order_id: id,
    status,
  });
};
