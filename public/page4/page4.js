let currentLang = localStorage.getItem("lang") || navigator.language.startsWith("en") ? "en" : "ar";
const translations = {};

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang); // حفظ اللغة
  updateLanguage();
  updateLangButton();
}

function updateLangButton() {
  const btn = document.querySelector(".lang-btn");
  if (btn) {
    btn.innerHTML = `<i class="fas fa-globe"></i> ${currentLang === 'ar' ? 'عربي' : 'English'}`;
  }
}

function updateLanguage() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      el.innerHTML = translations[currentLang][key];
    }
  });

  // تغيير اتجاه الصفحة واللغة
  document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", currentLang);
}

// تحميل ملف الترجمة
fetch("lang-page4.json")
  .then(response => response.json())
  .then(data => {
    Object.assign(translations, data);
    updateLanguage();
    updateLangButton();
  })
  .catch(error => console.error("خطأ في تحميل ملف الترجمة:", error));
