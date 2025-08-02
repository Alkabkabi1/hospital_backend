const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ حفظ بيانات النموذج
router.post("/", (req, res) => {
  const {
    stress_level,
    mental_health_impact,
    stress_comment,
    policy_confidentiality,
    policy_no_personal_use,
    policy_official_use,
    policy_respect,
    policy_report
  } = req.body;

  const sql = `
    INSERT INTO evaluation_form (
      stress_level,
      mental_health_impact,
      stress_comment,
      policy_confidentiality,
      policy_no_personal_use,
      policy_official_use,
      policy_respect,
      policy_report
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    stress_level,
    mental_health_impact,
    stress_comment,
    policy_confidentiality,
    policy_no_personal_use,
    policy_official_use,
    policy_respect,
    policy_report
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ Error saving evaluation:", err);
      return res.status(500).json({ message: "حدث خطأ أثناء حفظ النموذج" });
    }
    res.status(200).json({ message: "✅ تم إرسال النموذج بنجاح" });
  });
});

module.exports = router;
