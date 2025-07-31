const slider = document.getElementById('deptSlider');
const cardWidth = 270;

function slideLeft() {
  slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
}

function slideRight() {
  slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
}

const teamTitle = document.getElementById('teamTitle');
const slidesContainer = document.getElementById('teamSlides');
const slides = Array.from(slidesContainer.children);

let groups = [
  'إدارة المستشفى',
  'الفريق الطبي المساعد',
  'الإدارة التنفيذية'
];

let currentGroup = 0;

function updateTeamSlider() {
  slides.forEach((slide, idx) => {
    slide.style.display = idx === currentGroup ? 'flex' : 'none';
  });
  teamTitle.textContent = groups[currentGroup];
}

function nextTeamGroup() {
  currentGroup = (currentGroup + 1) % slides.length;
  updateTeamSlider();
}

function prevTeamGroup() {
  currentGroup = (currentGroup - 1 + slides.length) % slides.length;
  updateTeamSlider();
}

updateTeamSlider();

// 🔽 الترجمة
function toggleLanguage() {
  const currentLang = document.documentElement.lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('language', currentLang);
  loadLanguage(currentLang);
}

function loadLanguage(lang) {
  fetch('lang-page1.json')
    .then(res => res.json())
    .then(data => {
      const translations = data[lang];
      for (const key in translations) {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.textContent = translations[key];
      }

      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      // تغيير النص في زر اللغة
      const langBtn = document.querySelector('.lang-btn');
      langBtn.innerHTML = lang === 'ar' ? '<i class="fas fa-globe"></i> عربي' : '<i class="fas fa-globe"></i> English';

      // تغيير أسماء المجموعات للفريق
      groups = lang === 'ar'
        ? ['إدارة المستشفى', 'الفريق الطبي المساعد', 'الإدارة التنفيذية']
        : ['Hospital Management', 'Medical Team', 'Executive Team'];

      updateTeamSlider();
    });
}

// تحميل اللغة عند بداية الصفحة
const savedLang = localStorage.getItem('language') || 'ar';
loadLanguage(savedLang);
