/**
 * middleware/auth.js
 *
 * Provides middleware functions to protect routes by validating JSON Web Tokens
 * and verifying user roles.
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware: verifyToken
 *
 * Checks for a valid JWT in the Authorization header (Bearer <token>).
 * If valid, decodes the payload and attaches it to `req.user`.
 */
const verifyToken = (req, res, next) => {
  // Extract token from header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, email, role
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * Middleware: isAdmin
 *
 * Should be used AFTER verifyToken.
 * Checks if the decoded user has the 'admin' role.
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Access denied. User not authenticated." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Requires admin privileges." });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin
};
