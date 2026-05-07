const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

// Create the test user if they don't exist yet
const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get("admin@example.com");

if (!existingUser) {
  const hashedPassword = bcrypt.hashSync("password123", 10);
  db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
    "Admin User",
    "admin@example.com",
    hashedPassword
  );
  console.log("Test user created!");
}

// LOGIN route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check password
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create a token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

module.exports = router;