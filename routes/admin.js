const express = require("express");
const router = express.Router();
const db = require("../db");

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "غير مصرح" });
}

// ✅ إضافة سياسة
router.post("/policies", isAdmin, (req, res) => {
  const { title, content, effective_date } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "يرجى تعبئة العنوان والمحتوى" });
  }

  const sql = `
    INSERT INTO policies (title, content, effective_date)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [title, content, effective_date || null], (err) => {
    if (err) {
      console.error("خطأ في إضافة السياسة:", err);
      return res.status(500).json({ message: "فشل في إضافة السياسة" });
    }
    res.status(201).json({ message: "تمت إضافة السياسة بنجاح" });
  });
});

// ✅ إضافة خدمة حسب نوع المستخدم
router.post("/services", isAdmin, (req, res) => {
  const { title, description, link } = req.body;
  const type = req.query.type;

  if (!title || !description || !link || !type) {
    return res.status(400).json({ message: "يرجى تعبئة جميع الحقول الخاصة بالخدمة" });
  }

  let table;
  if (type === "staff") table = "staff_services";
  else if (type === "patients") table = "patient_services";
  else return res.status(400).json({ message: "نوع الفئة غير صالح" });

  const sql = `INSERT INTO ${table} (title, description, link) VALUES (?, ?, ?)`;
  db.query(sql, [title, description, link], (err) => {
    if (err) {
      console.error("❌ فشل في إضافة الخدمة:", err);
      return res.status(500).json({ message: "فشل في إضافة الخدمة" });
    }
    res.status(201).json({ message: "تمت إضافة الخدمة بنجاح" });
  });
});

module.exports = router;
