const express = require("express");
const router = express.Router();

// التحقق من صلاحية الجلسة للمريض فقط
router.get("/check-session", (req, res) => {
  if (req.session.user && req.session.user.role === "patient") {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(403).json({ success: false, message: "غير مصرح بالدخول" });
  }
});

module.exports = router;
