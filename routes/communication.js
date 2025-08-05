const express = require("express");
const router = express.Router();
const db = require("../db");

// استقبال رسالة التواصل
router.post("/send-message", (req, res) => {
  const { name, email, message } = req.body;

  // التحقق من إدخال جميع الحقول
  if (!name || !email || !message) {
    return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول" });
  }

  // إدخال البيانات في قاعدة البيانات
  const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("❌ خطأ في إدخال الرسالة:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء إرسال الرسالة" });
    }
    res.status(200).json({ message: "✅ تم إرسال الرسالة بنجاح" });
  });
});

module.exports = router;
