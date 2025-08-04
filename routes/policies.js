const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب كل السياسات
router.get("/policies", (req, res) => {
  const sql = "SELECT * FROM policies ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ خطأ في جلب السياسات:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء جلب السياسات" });
    }
    res.status(200).json(results);
  });
});

// ✅ إضافة سياسة جديدة
router.post("/policies", (req, res) => {
  const {
    title,
    content,
    description,
    category,
    icon,
    pdf_link,
    qr_link,
    effective_date
  } = req.body;

  // تحقق من الحقول الأساسية
  if (!title || !content || !description || !category || !icon) {
    return res.status(400).json({ message: "يرجى تعبئة العنوان والمحتوى والوصف والفئة والرمز" });
  }

  const sql = `
    INSERT INTO policies 
    (title, content, description, category, icon, pdf_link, qr_link, effective_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, content, description, category, icon, pdf_link, qr_link, effective_date], (err, result) => {
    if (err) {
      console.error("❌ خطأ في إضافة السياسة:", err);
      return res.status(500).json({ message: "فشل في حفظ السياسة" });
    }
    res.status(200).json({ message: "✅ تمت إضافة السياسة بنجاح" });
  });
});

module.exports = router;
