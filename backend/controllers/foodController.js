import pool from "../database/db.js";

// GET /api/foods
export const getAllFoods = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;

  let query = `
    SELECT 
      f.id, f.food_name, f.price, f.description, f.ingredients, 
      f.quantity, f.image, c.category_name, f.category_id
    FROM Foods f
    JOIN Categories c ON f.category_id = c.id
    WHERE 1=1
  `;
  const queryParams = [];

  if (search) {
    query += ` AND (f.food_name LIKE ? OR f.ingredients LIKE ?)`;
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    query += ` AND f.category_id = ?`;
    queryParams.push(category);
  }
  if (minPrice) {
    query += ` AND f.price >= ?`;
    queryParams.push(minPrice);
  }
  if (maxPrice) {
    query += ` AND f.price <= ?`;
    queryParams.push(maxPrice);
  }

  query += ` ORDER BY f.id DESC`;

  const [rows] = await pool.query(query, queryParams);
  return res.status(200).json(rows);
};

// GET /api/foods/:id
export const getFoodById = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      f.id, f.food_name, f.price, f.description, f.ingredients, 
      f.quantity, f.image, c.category_name, f.category_id
    FROM Foods f
    JOIN Categories c ON f.category_id = c.id
    WHERE f.id = ?
  `;

  const [rows] = await pool.query(query, [id]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "Food item not found." });
  }

  return res.status(200).json(rows[0]);
};

// POST /api/foods
export const createFood = async (req, res) => {
  const { food_name, category_id, price, description, ingredients, quantity } = req.body;
  
  let imagePath = null;
  if (req.file) {
    const base64Image = req.file.buffer.toString("base64");
    imagePath = `data:${req.file.mimetype};base64,${base64Image}`;
  }

  if (!food_name || !category_id || !price) {
    return res.status(400).json({ error: "food_name, category_id, and price are required." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Foods (food_name, category_id, price, description, ingredients, quantity, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        food_name,
        category_id,
        price,
        description || null,
        ingredients || null,
        quantity || 0,
        imagePath,
      ]
    );

    return res.status(201).json({
      message: "Food item created successfully.",
      food: {
        id: result.insertId,
        food_name,
        category_id,
        price,
        description,
        ingredients,
        quantity,
        image: imagePath,
      },
    });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid category_id. Category does not exist." });
    }
    throw err;
  }
};

// PUT /api/foods/:id
export const updateFood = async (req, res) => {
  const { id } = req.params;
  const { food_name, category_id, price, description, ingredients, quantity } = req.body;
  let newImagePath = null;
  if (req.file) {
    const base64Image = req.file.buffer.toString("base64");
    newImagePath = `data:${req.file.mimetype};base64,${base64Image}`;
  }

  try {
    const [existingFoods] = await pool.query("SELECT image FROM Foods WHERE id = ?", [id]);
    
    if (existingFoods.length === 0) {
      return res.status(404).json({ error: "Food item not found." });
    }

    let query = `UPDATE Foods SET `;
    const queryParams = [];
    const updates = [];

    if (food_name) { updates.push("food_name = ?"); queryParams.push(food_name); }
    if (category_id) { updates.push("category_id = ?"); queryParams.push(category_id); }
    if (price) { updates.push("price = ?"); queryParams.push(price); }
    if (description !== undefined) { updates.push("description = ?"); queryParams.push(description); }
    if (ingredients !== undefined) { updates.push("ingredients = ?"); queryParams.push(ingredients); }
    if (quantity !== undefined) { updates.push("quantity = ?"); queryParams.push(quantity); }
    
    if (newImagePath) {
      updates.push("image = ?");
      queryParams.push(newImagePath);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    query += updates.join(", ") + ` WHERE id = ?`;
    queryParams.push(id);

    await pool.query(query, queryParams);

    const [updatedFood] = await pool.query("SELECT * FROM Foods WHERE id = ?", [id]);

    return res.status(200).json({
      message: "Food item updated successfully.",
      food: updatedFood[0],
    });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Invalid category_id. Category does not exist." });
    }
    throw err;
  }
};

// DELETE /api/foods/:id
export const deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Foods WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Food item not found." });
    }

    return res.status(200).json({ message: "Food item deleted successfully." });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error: "Cannot delete food because it is associated with one or more orders.",
      });
    }
    throw err;
  }
};
