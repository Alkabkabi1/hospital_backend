const express = require("express");
const router = express.Router();

router.get("/check-session", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  }
  res.status(401).json({ message: "غير مسجل الدخول" });
});

module.exports = router;
