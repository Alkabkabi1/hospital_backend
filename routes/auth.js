const express = require("express");
const router = express.Router();
const db = require("../db");
const sendRecoveryEmail = require("../utils/emailService"); // ✅ 

// ✅ تسجيل الدخول
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // التأكد من أن البريد الإلكتروني موجود
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("خطأ في السيرفر:", err);
      return res.status(500).json({ message: "خطأ في السيرفر" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "البريد الإلكتروني غير مسجل" });
    }

    const user = results[0];

    // مقارنة كلمة المرور المدخلة مع المخزنة في قاعدة البيانات
    if (password !== user.password) {
      return res.status(401).json({ message: "كلمة المرور غير صحيحة" });
    }

    // تفعيل الجلسة للمستخدم
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log("تم تسجيل الدخول بنجاح:", req.session.user); // للتأكد من تفعيل الجلسة

    res.status(200).json({ message: "تم تسجيل الدخول بنجاح", user });
  });
});

// ✅ إنشاء حساب جديد
router.post("/signup", (req, res) => {
  const { name, email, password, phone, role } = req.body;  // تأكد من أن لديك employee_number في البيانات المدخلة

  const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, password, phone, role], (err, result) => {
    if (err) return res.status(500).json({ message: "خطأ في إنشاء المستخدم", error: err });

    const user_id = result.insertId; // نحصل على الـ user_id الذي تم إنشاؤه في جدول users

    // ✅ إذا كان المستخدم مريضًا، أنشئ سجل في جدول patients
    if (role === "visitor") {
      const insertPatient = `
        INSERT INTO patients (user_id, name, email, phone, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;

      db.query(insertPatient, [user_id, name, email, phone], (err2, result2) => {
        if (err2) return res.status(500).json({ message: "تم إنشاء المستخدم، لكن فشل إنشاء سجل المريض", error: err2 });
        req.session.user = {
          id: user_id,  // الـ ID من جدول users
          name,
          email,
          role
        };
        res.status(201).json({ message: "تم إنشاء حساب المريض بنجاح" });
      });
    } else {
      // ✅ توليد رقم موظف عشوائي إذا ما أرسل من الواجهة
      const generatedEmployeeNumber = 'EMP' + Math.floor(100000 + Math.random() * 900000);

      const insertEmployee = `
    INSERT INTO employees (
      name, email, user_id, position, department, photo_url, join_date, employee_number
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
  `;

      db.query(
        insertEmployee,
        [
          name,
          email,
          user_id,
          'default_position',
          'default_department',
          '',
          generatedEmployeeNumber
        ],
        (err2, result2) => {
          if (err2) {
            return res.status(500).json({
              message: "تم إنشاء المستخدم، لكن فشل إنشاء سجل الموظف",
              error: err2
            });
          }
          req.session.user = {
            id: user_id,
            name,
            email,
            role
          };
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
