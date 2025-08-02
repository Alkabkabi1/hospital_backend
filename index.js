const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const db = require("./db");

// تحميل متغيرات البيئة
dotenv.config();

// تهيئة التطبيق
const app = express();

// ميدل وير
app.use(cors());
app.use(bodyParser.json());

// 🟢 تهيئة الجلسات
app.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));


app.use((req, res, next) => {
    console.log("🔐 جلسة المستخدم:", req.session.user);
    next();
  });
  
// ملفات ثابتة
app.use(express.static(path.join(__dirname, "/public")));

// متغيرات عامة
global.recoveryCodes = {};

// ربط المسارات
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const patientHomeRoute = require("./routes/patientHome");
const userInfoRoute = require("./routes/userInfo");
const employeeHomeRoute = require("./routes/employeeHome");


app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/patient-home", patientHomeRoute);
app.use("/api/user-info", userInfoRoute);
app.use("/api/employee-home", employeeHomeRoute);

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
});
