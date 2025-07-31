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
setInterval(autoSlide, 5000);

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
setInterval(autoNewsSlide, 6000);

function toggleLanguage() {
  alert('📘 تغيير لغة الواجهة');
}

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".lang-btn");
  const elements = document.querySelectorAll("[data-key]");
  const savedLang = localStorage.getItem("lang") || "ar";

  function setLanguage(lang) {
    fetch("lang.json")
      .then((res) => res.json())
      .then((data) => {
        elements.forEach((el) => {
          const key = el.getAttribute("data-key");
          if (data[lang][key]) {
            el.textContent = data[lang][key];
          }
        });
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        localStorage.setItem("lang", lang);
        updateButtonLabel(lang);
      });
  }

  function updateButtonLabel(lang) {
    buttons.forEach((btn) => {
      btn.innerHTML = '<i class="fas fa-globe"></i> ' + (lang === "ar" ? "English" : "عربي");
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = localStorage.getItem("lang") === "ar" ? "en" : "ar";
      setLanguage(lang);
    });
  });

  setLanguage(savedLang);
});
