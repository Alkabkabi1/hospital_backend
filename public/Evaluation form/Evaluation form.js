let currentLang = "ar";
const translations = {};

// تحميل الترجمة
function loadTranslations() {
  fetch("lang-evaluation.json")
    .then((response) => response.json())
    .then((data) => {
      Object.assign(translations, data);
      applyTranslations();
    });
}

// تطبيق الترجمة
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

// تبديل اللغة
function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}


async function submitForm() {
  const stressLevel = document.querySelector("input[name='stress']:checked")?.value;
  const mentalImpactRadio = document.querySelector("input[name='mental']:checked")?.value;
  const comment = document.querySelector("textarea")?.value || "";

  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const checkboxValues = Array.from(checkboxes).map(cb => cb.checked);

  if (!stressLevel || !mentalImpactRadio) {
    alert(currentLang === "ar" ? "يرجى الإجابة على جميع الأسئلة" : "Please answer all questions.");
    return;
  }

  const bodyData = {
    stress_level: stressLevel,
    mental_health_impact: translateMentalImpact(mentalImpactRadio),
    stress_comment: comment,
    policy_confidentiality: checkboxValues[0],
    policy_no_personal_use: checkboxValues[1],
    policy_official_use: checkboxValues[2],
    policy_respect: checkboxValues[3],
    policy_report: checkboxValues[4]
  };

  try {
    const res = await fetch("/api/evaluation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    const result = await res.json();

    if (res.ok) {
      alert(currentLang === "ar" ? "✅ تم إرسال النموذج بنجاح" : "✅ Form submitted successfully!");
      document.querySelector("form")?.reset();
      window.location.href = "../home/home.html";
    } else {
      alert(result.message || (currentLang === "ar" ? "حدث خطأ أثناء الإرسال" : "Submission failed"));
    }
  } catch (err) {
    console.error("خطأ أثناء إرسال النموذج:", err);
    alert(currentLang === "ar" ? "فشل الاتصال بالخادم" : "Server connection failed");
  }
}

function translateMentalImpact(value) {
  // تحويل القيمة من الإنجليزية إلى ما يناسب ENUM في قاعدة البيانات
  switch (value) {
    case "no":
      return "لا";
    case "yes":
      return "نعم قليلاً";
    case "severe":
      return "نعم كثيراً";
    default:
      return "";
  }
}


// تحميل الترجمة بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadTranslations);
