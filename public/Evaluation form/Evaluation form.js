let currentLang = "ar";
const translations = {};

function loadTranslations() {
  fetch("lang-evaluation.json")
    .then((response) => response.json())
    .then((data) => {
      Object.assign(translations, data);
      applyTranslations();
    });
}

function applyTranslations() {
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");

    if (element.placeholder !== undefined && element.tagName === "TEXTAREA") {
      element.placeholder = translations[currentLang][key] || element.placeholder;
    } else if (element.placeholder !== undefined && element.tagName === "INPUT") {
      element.placeholder = translations[currentLang][key] || element.placeholder;
    } else {
      element.textContent = translations[currentLang][key] || element.textContent;
    }
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}

function submitForm() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const radios = document.querySelectorAll("input[type='radio']:checked");
  const textarea = document.querySelector("textarea").value;

  if (radios.length < 2) {
    alert(currentLang === "ar" ? "يرجى الإجابة على جميع الأسئلة" : "Please answer all questions.");
    return;
  }

  alert(currentLang === "ar" ? "تم إرسال النموذج بنجاح" : "Form submitted successfully!");
  document.querySelector("form")?.reset();
}

document.addEventListener("DOMContentLoaded", loadTranslations);
