const express = require("express");
const router = express.Router();

// ✅ استرجاع معلومات المستخدم من الجلسة
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "لم يتم تسجيل الدخول" });
  }

  res.json(req.session.user);
});

module.exports = router;
