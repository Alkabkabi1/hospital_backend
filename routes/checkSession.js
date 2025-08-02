const express = require("express");
const router = express.Router();

// ✅ يتحقق من الجلسة ويرجع معلومات المستخدم
router.get("/", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "غير مسجل الدخول" });
  }
});

module.exports = router;
