function toggleLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === "ar" ? "en" : "ar";
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  loadLanguage(newLang);
  document.getElementById("lang-text").textContent = newLang === "ar" ? "عربي" : "English";
}


function loadLanguage(lang) {
  fetch("lang-page3.json")
    .then((res) => res.json())
    .then((data) => {
      const elements = document.querySelectorAll("[data-key]");
      elements.forEach((el) => {
        const key = el.getAttribute("data-key");
        if (data[lang][key]) {
          el.textContent = data[lang][key];
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "ar";
  loadLanguage(lang);
});
