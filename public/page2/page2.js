// انزلاق بطاقات الأطباء
const slider = document.getElementById('doctorSlider');
const cardWidth = 270;

function slideRight() {
  slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
}

function slideLeft() {
  slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
}

// نظام الترجمة
function toggleLanguage() {
  const currentLang = document.documentElement.lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('language', currentLang);
  loadLanguage(currentLang);
}

function loadLanguage(lang) {
  fetch('lang-page2.json')
    .then(res => res.json())
    .then(data => {
      const translations = data[lang];
      for (const key in translations) {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.textContent = translations[key];
      }

      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      const langBtn = document.querySelector('.lang-btn');
      langBtn.innerHTML = lang === 'ar'
        ? '<i class="fas fa-globe"></i> عربي'
        : '<i class="fas fa-globe"></i> English';
    });
}

// تحميل اللغة عند بداية الصفحة
const savedLang = localStorage.getItem('language') || 'ar';
loadLanguage(savedLang);
element.innerHTML = translations[lang][key];
