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
        element.placeholder = value;
      } else {
        element.textContent = value;
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

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    // تحقق من الحقول
    if (!name || !email || !message) {
      formMessage.textContent = translations[currentLang]["error_message"];
      formMessage.style.color = "#d60000";
      return;
    }

    // إرسال للباك إند
    fetch("/api/communication/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    })
      .then(res => res.json())
      .then(data => {
        formMessage.textContent = data.message;
        formMessage.style.color = data.message.includes("تم") ? "#20a153" : "#d60000";

        if (data.message.includes("تم")) {
          setTimeout(() => {
            form.reset();
            formMessage.textContent = "";
          }, 3000);
        }
      })
      .catch(() => {
        formMessage.textContent = "حدث خطأ أثناء إرسال الرسالة";
        formMessage.style.color = "#d60000";
      });
  });
});
