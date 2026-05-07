const express = require("express");
const db = require("../database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const totalLeads = db.prepare("SELECT COUNT(*) as count FROM leads").get().count;
  const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'New'").get().count;
  const qualifiedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Qualified'").get().count;
  const wonLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Won'").get().count;
  const lostLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Lost'").get().count;
  const totalValue = db.prepare("SELECT SUM(deal_value) as total FROM leads").get().total || 0;
  const wonValue = db.prepare("SELECT SUM(deal_value) as total FROM leads WHERE status = 'Won'").get().total || 0;

  res.json({
    totalLeads,
    newLeads,
    qualifiedLeads,
    wonLeads,
    lostLeads,
    totalValue,
    wonValue
  });
});

module.exports = router;