const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب بيانات الموظف من الجلسة
router.get("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const sql = "SELECT * FROM employees WHERE user_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "خطأ في قاعدة البيانات" });
    if (result.length === 0) return res.status(404).json({ message: "لم يتم العثور على بيانات الموظف" });

    res.json(result[0]);
  });
});


module.exports = router;
