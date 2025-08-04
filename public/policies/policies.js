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
document.addEventListener("DOMContentLoaded", () => {
  fetchPolicies();
  setupTranslation();
});

function fetchPolicies() {
  fetch("/api/policies")
    .then(res => res.json())
    .then(policies => displayPolicies(policies))
    .catch(() => alert("❌ فشل في تحميل السياسات"));
}

function displayPolicies(policies) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  policies.forEach(policy => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-category", policy.category);

    card.innerHTML = `
      <div class="icon">${policy.icon}</div>
      <h4>${policy.title}</h4>
      <p>${policy.description}</p>
      <div class="tag">${policy.category}</div>
      <div class="tools">
        <a href="#" class="view-btn">👁️</a>
        ${policy.pdf_link ? `<a href="${policy.pdf_link}" target="_blank">📄</a>` : ""}
        ${policy.qr_link ? `<a href="${policy.qr_link}" target="_blank">🔳</a>` : ""}
      </div>
    `;
    container.appendChild(card);
  });
}

function setupTranslation() {
  const lang = localStorage.getItem("language") || "ar";

  fetch("/public/policies/lang-policies.json")
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (data[lang] && data[lang][key]) {
          el.innerHTML = data[lang][key];
        }
      });
    });

  // الفلاتر
  document.getElementById("filterMenu").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    document.querySelectorAll("#filterMenu li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    const filter = li.getAttribute("data-filter");
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = (filter === "all" || card.getAttribute("data-category") === filter)
        ? "block" : "none";
    });
  });

  // عرض التفاصيل
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

  window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  window.toggleLanguage = function () {
    const newLang = (lang === "ar") ? "en" : "ar";
    localStorage.setItem("language", newLang);
    location.reload();
  };
}
