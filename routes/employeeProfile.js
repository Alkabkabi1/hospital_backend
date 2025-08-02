const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب بيانات الموظف من الجلسة
router.get("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const sql = `
    SELECT 
      u.name, u.email, 
      e.position, e.employee_number, e.department, e.photo_url, e.join_date
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("❌ DB Error (GET):", err.message);
      return res.status(500).json({ message: "خطأ في قاعدة البيانات" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على بيانات الموظف" });
    }

    res.json(result[0]);
  });
});

// ✅ تحديث بيانات الموظف
router.put("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const {
    position,
    employee_number,
    photo_url
  } = req.body;

  // ✅ طباعة البيانات التي أُرسلت من الفرونت للتشخيص
  console.log("📥 بيانات مستلمة من الواجهة:", {
    userId,
    position,
    employee_number,
    photo_url
  });

  // ✅ تحقق من الحقول الأساسية
  if (!employee_number || !position) {
    return res.status(400).json({ message: "يرجى تعبئة الحقول المطلوبة: الرقم الوظيفي والمسمى الوظيفي" });
  }

  const sql = `
    INSERT INTO employees (user_id, position, employee_number, photo_url)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      position = VALUES(position),
      employee_number = VALUES(employee_number),
      photo_url = VALUES(photo_url)
  `;

  db.query(sql, [userId, position, employee_number, photo_url], (err, result) => {
    if (err) {
      console.error("❌ DB Error (PUT):", err.message);
      return res.status(500).json({ message: "فشل في تحديث البيانات" });
    }

    res.json({ message: "تم حفظ البيانات بنجاح" });
  });
});

module.exports = router;
