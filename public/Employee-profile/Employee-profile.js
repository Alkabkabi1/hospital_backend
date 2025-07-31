function showNotifications() {
  alert('💬 لديك 3 إشعارات جديدة');
}

function toggleLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === "ar" ? "en" : "ar";
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  loadTranslations(newLang);
}

function loadTranslations(lang) {
  fetch('lang-employee.json')
    .then(res => res.json())
    .then(data => {
      const translations = data[lang];
      document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[key]) {
          el.textContent = translations[key];
        }
      });
    });
}

// تحميل الترجمة عند بدء الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "ar";
  loadTranslations(lang);
});
