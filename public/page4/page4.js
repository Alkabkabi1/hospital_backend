let currentLang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ar");
const translations = {};

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);
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

  document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", currentLang);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("lang-page4.json")
    .then(response => response.json())
    .then(data => {
      Object.assign(translations, data);
      updateLanguage();
      updateLangButton();
    })
    .catch(error => console.error("خطأ في تحميل ملف الترجمة:", error));

  checkSessionAndLoadServices();
});

function checkSessionAndLoadServices() {
  fetch("/api/check-session")
    .then(res => {
      if (!res.ok) throw new Error("ليس لديك صلاحية");
      return res.json();
    })
    .then(data => {
      if (data.user.role !== "visitor"&& data.user.role !== "admin") {
        alert("هذه الصفحة مخصصة للمرضى فقط.");
        window.location.href = "../home3/home3.html";
        return;
      }

      fetchServices();
    })
    .catch(() => {
      alert("يرجى تسجيل الدخول للوصول إلى هذه الصفحة.");
      window.location.href = "../Login/Login.html";
    });
}

function fetchServices() {
  fetch("/api/services")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("servicesGrid");
      data.forEach(service => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-icon">🔹</div>
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <a href="${service.link}" class="btn">دخول</a>
        `;
        container.appendChild(card);
      });
    })
    .catch(() => alert("فشل تحميل الخدمات."));
}
