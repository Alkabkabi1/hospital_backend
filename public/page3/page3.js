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
  checkSessionAndLoadServices();
});

function checkSessionAndLoadServices() {
  fetch("/api/check-session")
    .then(res => {
      if (!res.ok) throw new Error("ليس لديك صلاحية");
      return res.json();
    })
    .then(data => {
      if (data.user.role !== "staff"&& data.user.role !== "admin") {
        alert("هذه الصفحة مخصصة للموظفين فقط.");
        window.location.href = "../home/home.html";
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
      const container = document.querySelector(".grid");
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
