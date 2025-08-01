const express = require("express");
const router = express.Router();
const db = require("../db");
const sendRecoveryEmail = require("../utils/emailService"); // ✅ 

// ✅ تسجيل الدخول
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "خطأ في السيرفر" });

    if (results.length === 0) {
      return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const user = results[0];

    // ✅ تفعيل الجلسة للمستخدم
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    

    res.status(200).json({ message: "تم تسجيل الدخول بنجاح", user });
  });
});


// ✅ إنشاء حساب جديد
router.post("/signup", (req, res) => {
  const { name, email, password, phone, role, employee_number } = req.body;  // تأكد من أن لديك employee_number في البيانات المدخلة

  const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, password, phone, role], (err, result) => {
    if (err) return res.status(500).json({ message: "خطأ في إنشاء المستخدم", error: err });

    const user_id = result.insertId;

    // ✅ إذا كان المستخدم مريضًا، أنشئ سجل في جدول patients
    if (role === "patient") {
      const insertPatient = `
        INSERT INTO patients (user_id, name, email, phone, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      db.query(insertPatient, [user_id, name, email, phone], (err2, result2) => {
        if (err2) return res.status(500).json({ message: "تم إنشاء المستخدم، لكن فشل إنشاء سجل المريض", error: err2 });

        res.status(201).json({ message: "تم إنشاء حساب المريض بنجاح" });
      });
    } else {
      // ✅ إذا كان موظف فقط، أنشئ سجل في جدول الموظفين
      const insertEmployee = `
        INSERT INTO employees (
          name, email, user_id, position, department, bio, photo_url, status, join_date, employee_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `;
      db.query(
        insertEmployee,
        [
          name,                // name
          email,               // email
          user_id,             // user_id
          'default_position',  // position (or from req.body)
          'default_department',// department (or from req.body)
          '',                  // bio (or from req.body)
          '',                  // photo_url (or from req.body)
          'active',            // status
          employee_number      // employee_number
        ],
        (err2, result2) => {
          if (err2) return res.status(500).json({ message: "تم إنشاء المستخدم، لكن فشل إنشاء سجل الموظف", error: err2 });

          res.status(201).json({ message: "تم إنشاء حساب الموظف بنجاح" });
        }
      );
    }
  });
});


// ✅ إرسال رمز الاستعادة
router.post("/send-recovery", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "خطأ في قاعدة البيانات" });

    if (results.length === 0) {
      return res.status(404).json({ message: "البريد غير مسجل لدينا" });
    }

    // ✅ تخزين الرمز مؤقتًا
    if (!global.recoveryCodes) global.recoveryCodes = {};
    global.recoveryCodes[email] = code;

    // ✅ إرسال البريد
    sendRecoveryEmail(email, code)
      .then(() => {
        res.json({ message: "تم إرسال رمز الاستعادة إلى بريدك الإلكتروني" });
      })
      .catch((error) => {
        console.error("فشل في إرسال البريد:", error);
        res.status(500).json({ message: "تعذر إرسال البريد الإلكتروني" });
      });
  });
});

// ✅ التحقق من الرمز
router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!global.recoveryCodes || !global.recoveryCodes[email]) {
    return res.status(400).json({ success: false, message: "لا يوجد رمز مرسل لهذا البريد" });
  }

  if (global.recoveryCodes[email] !== code) {
    return res.status(401).json({ success: false, message: "رمز التحقق غير صحيح" });
  }

  delete global.recoveryCodes[email]; // حذف الرمز بعد التحقق
  res.json({ success: true, message: "تم التحقق من الرمز بنجاح" });
});

// ✅ تحديث كلمة المرور
router.post("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "جميع الحقول مطلوبة" });
  }

  const sql = "UPDATE users SET password = ? WHERE email = ?";
  db.query(sql, [newPassword, email], (err, result) => {
    if (err) {
      console.error("خطأ في تحديث كلمة المرور:", err);
      return res.status(500).json({ success: false, message: "خطأ في السيرفر" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "لم يتم العثور على هذا البريد" });
    }

    res.json({ success: true, message: "تم تحديث كلمة المرور بنجاح" });
  });
});

module.exports = router;
