import pool from "../database/db.js";

// GET /api/categories
export const getAllCategories = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Categories ORDER BY category_name ASC");
  return res.status(200).json(rows);
};

// POST /api/categories
export const createCategory = async (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO Categories (category_name) VALUES (?)",
      [category_name]
    );

    return res.status(201).json({
      message: "Category created successfully.",
      category: {
        id: result.insertId,
        category_name,
      },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Category name already exists." });
    }
    throw err;
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE Categories SET category_name = ? WHERE id = ?",
      [category_name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      category: { id: parseInt(id), category_name },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Category name already exists." });
    }
    throw err;
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Categories WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error: "Cannot delete category because it is associated with one or more foods.",
      });
    }
    throw err;
  }
};
