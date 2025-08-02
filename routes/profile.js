const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ جلب بيانات المريض باستخدام user_id من الجلسة
router.get("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const sql = `
    SELECT 
      u.name, u.email, u.phone,
      p.birth_date, p.blood_type, p.address, p.mrn, p.national_id, p.marital_status
    FROM users u
    LEFT JOIN patients p ON u.id = p.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "خطأ في قاعدة البيانات" });
    if (result.length === 0) return res.status(404).json({ message: "لم يتم العثور على بيانات المريض" });

    res.json(result[0]);
  });
});

// ✅ تحديث بيانات المريض في الجدولين: users + patients
router.post("/", (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "غير مصرح. يرجى تسجيل الدخول." });
  }

  const {
    name,
    birth_date,
    blood_type,
    address,
    email,
    mrn,
    national_id,
    phone,
    marital_status,
  } = req.body;

  // ✅ أولًا: تحديث جدول users
  const updateUser = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
  db.query(updateUser, [name, email, phone, userId], (err1) => {
    if (err1) {
      console.error("❌ خطأ في تحديث جدول users:", err1);
      return res.status(500).json({ message: "فشل تحديث بيانات المستخدم" });
    }

    // ✅ ثانيًا: تحديث جدول patients
    const updatePatient = `
      UPDATE patients SET
        name = ?, email = ?, phone = ?,
        birth_date = ?, blood_type = ?, address = ?,
        mrn = ?, national_id = ?, marital_status = ?
      WHERE user_id = ?
    `;

    const values = [
      name, email, phone,
      birth_date, blood_type, address,
      mrn, national_id, marital_status,
      userId,
    ];

    db.query(updatePatient, values, (err2) => {
      if (err2) {
        console.error("❌ خطأ في تحديث جدول patients:", err2);
        return res.status(500).json({ message: "فشل تحديث بيانات المريض" });
      }

      res.json({ message: "✅ تم تحديث بيانات الملف الشخصي بنجاح" });
    });
  });
});

module.exports = router;
