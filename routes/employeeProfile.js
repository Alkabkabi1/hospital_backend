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

// ✅ تحديث بيانات الموظف في users و employees
router.put("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const {
    name,
    email,
    position,
    employee_number,
    photo_url
  } = req.body;

  if (!name || !email || !position || !employee_number) {
    return res.status(400).json({ message: "يرجى تعبئة جميع الحقول المطلوبة" });
  }

  console.log("📥 بيانات مستلمة من الواجهة:", {
    userId, name, email, position, employee_number, photo_url
  });

  // ✅ أولًا: تحديث جدول users
  const updateUserSql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(updateUserSql, [name, email, userId], (err1) => {
    if (err1) {
      console.error("❌ DB Error (users):", err1.message);
      return res.status(500).json({ message: "فشل تحديث بيانات المستخدم" });
    }

    // ✅ ثانيًا: تحديث أو إدخال البيانات في جدول employees
    const updateEmployeeSql = `
      INSERT INTO employees (user_id, name, email, position, employee_number, photo_url)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        position = VALUES(position),
        employee_number = VALUES(employee_number),
        photo_url = VALUES(photo_url)
    `;

    db.query(updateEmployeeSql, [userId, name, email, position, employee_number, photo_url], (err2) => {
      if (err2) {
        console.error("❌ DB Error (employees):", err2.message);
        return res.status(500).json({ message: "فشل في تحديث بيانات الموظف" });
      }

      res.json({ message: "✅ تم حفظ البيانات بنجاح في كلا الجدولين" });
    });
  });
});

module.exports = router;
