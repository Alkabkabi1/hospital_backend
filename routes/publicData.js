const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب جميع السياسات (متاحة للجميع)
router.get("/policies", (req, res) => {
  const sql = "SELECT * FROM policies ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ فشل في جلب السياسات:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء جلب السياسات" });
    }

    res.json(results);
  });
});

// ✅ جلب الخدمات حسب نوع المستخدم (يدعم الفصل إلى جدولين)
router.get("/services", (req, res) => {
  const role = req.session?.user?.role;

  if (!role || !["staff", "visitor", "admin"].includes(role)) {
    return res.status(403).json({ message: "غير مصرح. يرجى تسجيل الدخول" });
  }

  let sql;

  if (role === "admin") {
    sql = `
      SELECT id, title, description, link, created_at, 'staff' AS target FROM staff_services
      UNION
      SELECT id, title, description, link, created_at, 'patients' AS target FROM patient_services
      ORDER BY created_at DESC
    `;
  } else if (role === "staff") {
    sql = "SELECT * FROM staff_services ORDER BY created_at DESC";
  } else {
    // visitor = patients
    sql = "SELECT * FROM patient_services ORDER BY created_at DESC";
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ فشل في جلب الخدمات:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء جلب الخدمات" });
    }

    res.json(results);
  });
});

module.exports = router;
