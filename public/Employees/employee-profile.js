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

      const isComplete = localStorage.getItem("evalStatus") === "complete";
      const evalStatusEl = document.querySelector('[data-key="Rated"]');
      if (evalStatusEl) {
        const statusKey = isComplete ? 'eval_status_desc_complete' : 'eval_status_desc_incomplete';
        evalStatusEl.textContent = translations[statusKey];
      }
    });
}

// ✅ تحميل البيانات من قاعدة البيانات عند بدء الصفحة
document.addEventListener("DOMContentLoaded", async () => {
  const lang = document.documentElement.lang || "ar";
  loadTranslations(lang);

  try {
    const res = await fetch("/api/employeeProfile", {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "فشل تحميل بيانات الملف الشخصي");
      return;
    }

    document.getElementById('empName').value = data.name || "";
    document.getElementById('empRole').value = data.position || "";
    document.getElementById('empEmail').value = data.email || "";
    document.getElementById('empID').value = data.employee_number || "";

    const imageData = localStorage.getItem('profileImage');
    if (imageData) {
      document.getElementById('profileImage').src = imageData;
    }

  } catch (err) {
    console.error("Error loading profile:", err);
  }
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

async function saveProfile() {
  const name = document.getElementById('empName').value;
  const email = document.getElementById('empEmail').value;
  const position = document.getElementById('empRole').value;
  const employee_number = document.getElementById('empID').value;
  const photo_url = localStorage.getItem('profileImage') || null;

  try {
    const res = await fetch("/api/employeeProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        position,
        employee_number,
        photo_url
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "فشل في حفظ البيانات");
      return;
    }

    alert('✅ تم حفظ البيانات بنجاح!');
    localStorage.setItem("evalStatus", "complete");

    document.getElementById('empName').disabled = true;
    document.getElementById('empRole').disabled = true;
    document.getElementById('empID').disabled = true;
    document.getElementById('empEmail').disabled = true;
    document.getElementById('imageUpload').disabled = true;

  } catch (err) {
    console.error("Error saving profile:", err);
    alert("حدث خطأ أثناء حفظ البيانات");
  }
}
