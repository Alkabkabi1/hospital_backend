const nodemailer = require("nodemailer");

// ✅ إعداد المرسل
const transporter = nodemailer.createTransport({
  service: "gmail", // أو استخدمي smtp من مزود بريد آخر
  auth: {
    user: process.env.EMAIL_USER, // بريدك
    pass: process.env.EMAIL_PASS, // كلمة المرور أو App Password
  },
});

// ✅ إرسال الرمز
function sendRecoveryEmail(to, code) {
  const mailOptions = {
    from: `"King Abdulaziz Hospital" <${process.env.EMAIL_USER}>`,
    to,
    subject: "رمز استعادة كلمة المرور",
    html: `
      <h2>مرحبًا من مستشفى الملك عبد العزيز</h2>
      <p>رمز استعادة كلمة المرور هو:</p>
      <h3 style="color: #2f4553">${code}</h3>
      <p>يُرجى استخدام هذا الرمز خلال 10 دقائق.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendRecoveryEmail;
