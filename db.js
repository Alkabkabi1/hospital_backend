const mysql = require("mysql2");
require("dotenv").config(); // تحميل المتغيرات من .env


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("خطأ في الاتصال بقاعدة البيانات:", err);
  } else {
    console.log("✅ تم الاتصال بقاعدة البيانات بنجاح");
  }
});

module.exports = db;
