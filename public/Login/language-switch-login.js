document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-key]");
    const buttons = document.querySelectorAll(".lang-btn");
    const savedLang = localStorage.getItem("lang") || "ar";
  
    function setLanguage(lang) {
      fetch("lang-login.json")
        .then((res) => res.json())
        .then((data) => {
          elements.forEach((el) => {
            const key = el.getAttribute("data-key");
            if (key && data[lang][key]) {
              // إذا كان العنصر input أو textarea يتم تعديل الـ placeholder
              if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.setAttribute("placeholder", data[lang][key]);
              } else {
                el.textContent = data[lang][key];
              }
            }
          });
  
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = lang;
          localStorage.setItem("lang", lang);
          updateButtonLabel(lang);
        });
    }
  
    function updateButtonLabel(lang) {
      buttons.forEach((btn) => {
        btn.innerHTML = `<i class="fas fa-globe"></i> ${lang === "ar" ? "English" : "عربي"}`;
      });
    }
  
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const newLang = localStorage.getItem("lang") === "ar" ? "en" : "ar";
        setLanguage(newLang);
      });
    });
  
    // تفعيل اللغة عند تحميل الصفحة
    setLanguage(savedLang);
  });
  