let translations = {};
let currentLang = localStorage.getItem("language") || (navigator.language.startsWith("en") ? "en" : "ar");

// تحميل ملف الترجمة
fetch("lang-reset.json")
  .then(response => response.json())
  .then(data => {
    translations = data;
    applyTranslations();
  });

function applyTranslations() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("language", currentLang);
  applyTranslations();
}

function getTranslation(key) {
  return translations[currentLang]?.[key] || key;
}

// ✅ التحقق من كلمة المرور وإرسالها
function validatePassword() {
  const password = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  const isValidLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (!isValidLength || !hasUppercase || !hasSpecialChar) {
    showMessage("error", getTranslation("msg_invalid"));
    return;
  }

  if (password !== confirm) {
    showMessage("error", getTranslation("msg_mismatch"));
    return;
  }

  const email = localStorage.getItem("emailToReset"); // ✅ البريد المراد التحديث له

  if (!email) {
    showMessage("error", getTranslation("msg_missing_email"));
    return;
  }

  // ✅ إرسال الطلب إلى السيرفر
  fetch("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword: password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showMessage("success", getTranslation("msg_success"));
        setTimeout(() => {
          localStorage.removeItem("emailToReset");
          window.location.href = "/Login/login.html";
        }, 2000);
      } else {
        showMessage("error", data.message || getTranslation("msg_failed"));
      }
    })
    .catch(() => {
      showMessage("error", getTranslation("msg_server_error"));
    });
}

// ✅ إظهار الرسائل
function showMessage(type, text) {
  const messageBox = document.getElementById("message");
  messageBox.style.display = 'block';
  messageBox.style.backgroundColor = type === "success" ? '#e6f9ec' : '#ffe6e6';
  messageBox.style.color = type === "success" ? '#20a153' : '#d60000';
  messageBox.style.border = type === "success" ? '1px solid #b0e6c7' : '1px solid #f3b3b3';
  messageBox.textContent = text;
}
