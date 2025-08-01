const express = require('express');
const path = require('path');
const session = require('express-session'); // الجلسات
const app = express();

console.log("server.js loaded");

// ✅ تفعيل الجلسات (قبل الراوترات)
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ✅ لتحليل JSON (قبل الراوترات)
app.use(express.json());

// ✅ استيراد الراوترات
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sessionRoutes = require('./routes/userInfo');
const sessionCheckRoutes = require('./routes/patientHome');
const employeeProfile = require("./routes/employeeProfile");
const evaluationRoutes = require("./routes/evaluation");


// ✅ ربط الراوترات
app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/check-session', sessionCheckRoutes);
app.use("/api/employeeProfile", employeeProfile);
app.use('/api/evaluation', evaluationRoutes);

// ✅ عرض ملفات الواجهة
app.use(express.static(path.join(__dirname, 'public')));

// ✅ تشغيل السيرفر
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
