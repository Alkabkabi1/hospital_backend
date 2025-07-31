// ===== سلايدر العرض الرئيسي =====
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('dots');
let currentIndex = 0;

slides.forEach((_, idx) => {
  const dot = document.createElement('span');
  dot.addEventListener('click', () => showSlide(idx));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('span');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentIndex = index;
}

function autoSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

showSlide(currentIndex);
setInterval(autoSlide, 5000); // كل 5 ثوانٍ

// ===== سلايدر الأخبار =====
const newsSlides = document.querySelectorAll('.news-slide');
const newsDotsContainer = document.getElementById('newsDots');
let newsIndex = 0;

newsSlides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.addEventListener('click', () => showNewsSlide(i));
  newsDotsContainer.appendChild(dot);
});

const newsDots = newsDotsContainer.querySelectorAll('span');

function showNewsSlide(index) {
  newsSlides.forEach(slide => slide.classList.remove('active'));
  newsDots.forEach(dot => dot.classList.remove('active'));

  newsSlides[index].classList.add('active');
  newsDots[index].classList.add('active');

  newsIndex = index;
}

function autoNewsSlide() {
  newsIndex = (newsIndex + 1) % newsSlides.length;
  showNewsSlide(newsIndex);
}

showNewsSlide(newsIndex);
setInterval(autoNewsSlide, 6000); // كل 6 ثوانٍ

// ===== الترجمة الثنائية =====
let currentLang = localStorage.getItem("lang") || "ar";
const translations = {};

function loadTranslations() {
  fetch("home2.json")
    .then((res) => res.json())
    .then((data) => {
      Object.assign(translations, data);
      applyTranslations();
    });
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  // تغيير الاتجاه
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = currentLang;

  updateButtonLabel();
  localStorage.setItem("lang", currentLang);
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}

function updateButtonLabel() {
  const btns = document.querySelectorAll(".lang-btn");
  btns.forEach((btn) => {
    btn.innerHTML = '<i class="fas fa-globe"></i> ' + (currentLang === "ar" ? "English" : "عربي");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTranslations();
});
