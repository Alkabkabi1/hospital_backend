const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب بيانات المريض باستخدام user_id من الجلسة
router.get("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const sql = "SELECT * FROM patients WHERE user_id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "خطأ في قاعدة البيانات" });
    if (result.length === 0) return res.status(404).json({ message: "لم يتم العثور على بيانات المريض" });

    res.json(result[0]);
  });
});

// ✅ تحديث بيانات المريض
router.post("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const {
    name, // ← بدلًا من full_name
    birth_date,
    blood_type,
    address,
    email,
    mrn,
    national_id,
    phone,
    marital_status,
  } = req.body;

  const sql = `
    UPDATE patients SET
      name = ?, birth_date = ?, blood_type = ?, address = ?,
      email = ?, mrn = ?, national_id = ?, phone = ?, marital_status = ?
    WHERE user_id = ?
  `;

  const values = [
    name,
    birth_date,
    blood_type,
    address,
    email,
    mrn,
    national_id,
    phone,
    marital_status,
    userId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("خطأ في تحديث البيانات:", err);
      return res.status(500).json({ message: "فشل تحديث البيانات" });
    }

    res.json({ message: "✅ تم تحديث بيانات الملف الشخصي بنجاح" });
  });
});

module.exports = router;
