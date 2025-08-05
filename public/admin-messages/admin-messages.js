let currentLang = localStorage.getItem("language") || "ar";
let translations = {};

function loadTranslations() {
  fetch("lang-admin-messages.json")
    .then(res => res.json())
    .then(data => {
      translations = data;
      applyTranslations();
    });
}

function applyTranslations() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    const value = translations[currentLang]?.[key];
    if (value) el.textContent = value;
  });

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("language", currentLang);
  location.reload();
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();

  fetch("/api/communication/messages")
    .then(res => res.json())
    .then(data => displayMessages(data))
    .catch(() => alert("❌ فشل في تحميل الرسائل"));

  document.getElementById("filterMenu").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    document.querySelectorAll("#filterMenu li").forEach(el => el.classList.remove("active"));
    li.classList.add("active");

    const filter = li.getAttribute("data-filter");
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = (filter === "all" || card.dataset.category === filter) ? "block" : "none";
    });
  });
});

function displayMessages(messages) {
  const container = document.getElementById("cardContainer");

  if (!messages.length) {
    container.innerHTML = `<p>${translations[currentLang]?.no_messages || "لا توجد رسائل"}</p>`;
    return;
  }

  messages.forEach(msg => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.category = msg.type === "patient" ? "patients" : "visitors";
    const icon = msg.type === "patient" ? "🩺" : "📧";

    card.innerHTML = `
      <div class="icon">${icon}</div>
      <h4>${msg.name}</h4>
      <p>${msg.message.substring(0, 100)}...</p>
      <div class="tag">${msg.email}</div>
      <div class="tools">
        <a href="#" class="view-btn">${translations[currentLang]?.view_details || "👁️"}</a>
        <span title="${new Date(msg.created_at).toLocaleString('ar-EG')}">🕓</span>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      document.getElementById("modalTitle").innerText = card.querySelector("h4").innerText;
      document.getElementById("modalDesc").innerText = card.querySelector("p").innerText;
      document.getElementById("modal").style.display = "flex";
    });
  });
}
