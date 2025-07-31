let currentLang = "ar";
const translations = {};

// ✅ تحميل الترجمة من ملف JSON
function loadTranslations() {
  fetch("lang-forgot.json")
    .then((response) => response.json())
    .then((data) => {
      Object.assign(translations, data);
      applyTranslations();
    });
}

// ✅ تطبيق الترجمة على العناصر
function applyTranslations() {
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      if (element.tagName === "INPUT") {
        element.setAttribute("placeholder", translations[currentLang][key]);
      } else {
        element.textContent = translations[currentLang][key];
      }
    }
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
}

// ✅ تبديل اللغة
function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}

// ✅ إرسال رمز الاستعادة إلى البريد
function sendRecovery() {
  const email = document.getElementById("emailInput").value.trim();

  if (!email) {
    alert(currentLang === "ar" ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email");
    return;
  }

  fetch("/api/send-recovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
    })
    .catch(() => {
      alert(currentLang === "ar" ? "فشل الاتصال بالخادم" : "Failed to connect to server");
    });
}

// ✅ التحقق من الرمز
function verifyCode() {
  const email = document.getElementById("emailInput").value.trim();
  const code = document.getElementById("codeInput").value.trim();

  if (!email || !code) {
    alert(currentLang === "ar" ? "يرجى إدخال البريد والرمز" : "Please enter both email and code");
    return;
  }

  fetch("/api/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert(data.message);
        window.location.href = "/reset-password/reset-password.html";
      } else {
        alert(data.message);
      }
    })
    .catch(() => {
      alert(currentLang === "ar" ? "حدث خطأ أثناء التحقق" : "An error occurred while verifying");
    });
}

// ✅ عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();
});
