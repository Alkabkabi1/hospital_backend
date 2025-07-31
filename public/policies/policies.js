document.addEventListener("DOMContentLoaded", () => {
  // تحميل ملف الترجمة تلقائيًا حسب اللغة
  const defaultLang = navigator.language.startsWith('en') ? 'en' : 'ar';
  const currentLang = localStorage.getItem('language') || defaultLang;

  fetch('lang-policies.json')
    .then(res => res.json())
    .then(data => {
      applyTranslation(data, currentLang);
    });

  // زر تغيير اللغة
  window.toggleLanguage = function () {
    const newLang = (localStorage.getItem('language') === 'ar') ? 'en' : 'ar';
    localStorage.setItem('language', newLang);
    location.reload();
  };
});

function applyTranslation(langData, lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (langData[lang] && langData[lang][key]) {
      el.innerHTML = langData[lang][key];
    }
  });

  // تحديث اتجاه الصفحة واللغة
  if (lang === 'en') {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  } else {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }
}

// فلترة البطاقات
document.addEventListener("DOMContentLoaded", () => {
  const filterMenu = document.getElementById("filterMenu");
  const cards = document.querySelectorAll(".card");

  filterMenu.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    document.querySelectorAll("#filterMenu li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    const filter = li.getAttribute("data-filter");

    cards.forEach(card => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category.includes(filter)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// عرض تفاصيل البطاقة في نافذة منبثقة
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-btn")) {
    e.preventDefault();
    const card = e.target.closest(".card");
    const title = card.querySelector("h4").innerText;
    const desc = card.querySelector("p").innerText;
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("modal").style.display = "block";
  }
});

// إغلاق النافذة المنبثقة
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.querySelectorAll("[data-key]").forEach(el => {
  const key = el.getAttribute("data-key");
  if (translations[lang][key]) {
    el.innerHTML = translations[lang][key];
  }
});
