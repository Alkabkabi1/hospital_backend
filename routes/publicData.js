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

// ✅ جلب الخدمات حسب نوع المستخدم (مع دعم الأدمن)
router.get("/services", (req, res) => {
  const role = req.session?.user?.role;

  if (!role || !["staff", "visitor", "admin"].includes(role)) {
    return res.status(403).json({ message: "غير مصرح. يرجى تسجيل الدخول" });
  }

  let sql;
  let values;

  // ✅ لو الأدمن: يرجع كل الخدمات
  if (role === "admin") {
    sql = "SELECT * FROM services ORDER BY id DESC";
    values = [];
  } else {
    sql = "SELECT * FROM services WHERE target = ? ORDER BY id DESC";
    values = [role];
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("❌ فشل في جلب الخدمات:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء جلب الخدمات" });
    }

    res.json(results);
  });
});

module.exports = router;
