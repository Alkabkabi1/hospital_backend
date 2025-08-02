function toggleLanguage() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === "ar" ? "en" : "ar";
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  loadTranslations(newLang);
}

function loadTranslations(lang) {
  fetch('lang-employee.json')
    .then(res => res.json())
    .then(data => {
      const translations = data[lang];
      document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        const value = translations[key];
        if (!value) return;

        if (el.tagName === 'INPUT') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      });

      // تحديث حالة التقييم إن وجد
      const isComplete = localStorage.getItem("evalStatus") === "complete";
      const evalStatusEl = document.querySelector('[data-key="Rated"]');
      if (evalStatusEl) {
        const statusKey = isComplete ? 'eval_status_desc_complete' : 'eval_status_desc_incomplete';
        evalStatusEl.textContent = translations[statusKey];
      }
    });
}

// تحميل الترجمة عند بدء الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "ar";
  loadTranslations(lang);

  // استرجاع البيانات عند التحميل
  const name = localStorage.getItem('empName');
  const role = localStorage.getItem('empRole');
  const email = localStorage.getItem('empEmail');
  const empID = localStorage.getItem('empID');
  const imageData = localStorage.getItem('profileImage');

  if (name) document.getElementById('empName').value = name;
  if (role) document.getElementById('empRole').value = role;
  if (email) document.getElementById('empEmail').value = email;
  if (empID) document.getElementById('empID').value = empID;
  if (imageData) document.getElementById('profileImage').src = imageData;
});

// عند النقر على الصورة
document.getElementById('profileImage').addEventListener('click', () => {
  document.getElementById('imageUpload').click();
});

// حفظ الصورة عند الرفع
document.getElementById('imageUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('profileImage').src = e.target.result;
      localStorage.setItem('profileImage', e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

function enableEditing() {
  document.getElementById('empName').disabled = false;
  document.getElementById('empRole').disabled = false;
  document.getElementById('empID').disabled = false;
  document.getElementById('empEmail').disabled = false;
  document.getElementById('imageUpload').disabled = false;
}

function saveProfile() {
  localStorage.setItem('empName', document.getElementById('empName').value);
  localStorage.setItem('empRole', document.getElementById('empRole').value);
  localStorage.setItem('empEmail', document.getElementById('empEmail').value);
  localStorage.setItem('empID', document.getElementById('empID').value);

  // تحديث حالة التقييم كنموذج
  localStorage.setItem("evalStatus", "complete");

  alert('✅ تم حفظ البيانات بنجاح!');

  document.getElementById('empName').disabled = true;
  document.getElementById('empRole').disabled = true;
  document.getElementById('empID').disabled = true;
  document.getElementById('empEmail').disabled = true;
  document.getElementById('imageUpload').disabled = true;
}
