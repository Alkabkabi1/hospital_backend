const express = require('express');
const path = require('path');
const session = require('express-session'); // الجلسات
const app = express();

// ✅ استيراد الراوترات
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const sessionRoutes = require('./routes/userInfo');
const sessionCheckRoutes = require('./routes/patientHome');
const employeeProfile = require("./routes/employeeProfile");


console.log("server.js loaded");

// ✅ تفعيل الجلسات
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ✅ لتحليل JSON
app.use(express.json());

// ✅ عرض ملفات الواجهة
app.use(express.static(path.join(__dirname, 'public')));

// ✅ الربط بالراوترات
app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/check-session', sessionCheckRoutes);
app.use("/api/employee-profile", employeeProfile);


// ✅ تشغيل السيرفر
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
