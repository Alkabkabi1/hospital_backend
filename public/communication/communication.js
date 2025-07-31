let currentLang = "ar";

const translations = {};

function loadTranslations() {
  fetch("lang-communication.json")
    .then((response) => response.json())
    .then((data) => {
      Object.assign(translations, data);
      applyTranslations();
    });
}
function applyTranslations() {
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    const value = translations[currentLang]?.[key];
    if (value) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = value; // ✔ تحديث placeholder
      } else {
        element.textContent = value; // ✔ تحديث النص العادي
      }
    }
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}

// إرسال النموذج
document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();

  const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !message) {
      formMessage.textContent = translations[currentLang]["error_message"];
      formMessage.style.color = "#d60000";
      return;
    }

    // عرض رسالة نجاح وهمية
    formMessage.textContent = translations[currentLang]["success_message"];
    formMessage.style.color = "#20a153";

    // إعادة تعيين النموذج بعد 3 ثوانٍ
    setTimeout(() => {
      form.reset();
      formMessage.textContent = "";
    }, 3000);
  });
});
