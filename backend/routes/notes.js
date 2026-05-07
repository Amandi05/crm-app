const express = require("express");
const db = require("../database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET all notes for a lead
router.get("/:leadId", verifyToken, (req, res) => {
  const notes = db.prepare(
    "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC"
  ).all(req.params.leadId);
  res.json(notes);
});

// ADD a note to a lead
router.post("/:leadId", verifyToken, (req, res) => {
  const { content, created_by } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Note content is required" });
  }

  const result = db.prepare(
    "INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)"
  ).run(req.params.leadId, content, created_by || req.user.name);

  const newNote = db.prepare("SELECT * FROM notes WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(newNote);
});

module.exports = router;