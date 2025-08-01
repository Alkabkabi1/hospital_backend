// ✅ تحميل بيانات المريض عند فتح الصفحة
window.onload = async () => {
  try {
    const res = await fetch("/api/profile");

    const data = await res.json();

    if (res.ok) {
      document.getElementById("fullName").value = data.name || "";
      document.getElementById("birthDate").value = data.birth_date || "";
      document.getElementById("bloodType").value = data.blood_type || "";
      document.getElementById("location").value = data.address || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("mrn").value = data.mrn || "";
      document.getElementById("idNum").value = data.national_id || "";
      document.getElementById("phone").value = data.phone || "";
      document.getElementById("status").value = data.marital_status || "";
    } else {
      alert(data.message || "حدث خطأ في تحميل البيانات");
    }
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error);
    alert("تعذر الاتصال بالسيرفر");
  }

  loadLanguage(); // تحميل الترجمة بعد تحميل البيانات
};

// ✅ حفظ البيانات المحدثة
async function saveData() {
  const updatedData = {
    full_name: document.getElementById("fullName").value,
    birth_date: document.getElementById("birthDate").value,
    blood_type: document.getElementById("bloodType").value,
    address: document.getElementById("location").value,
    email: document.getElementById("email").value,
    mrn: document.getElementById("mrn").value,
    national_id: document.getElementById("idNum").value,
    phone: document.getElementById("phone").value,
    marital_status: document.getElementById("status").value,
  };

  try {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ تم حفظ البيانات بنجاح");
      document.querySelectorAll('.info-pair input').forEach(input => input.disabled = true);
      document.getElementById("saveBtn").disabled = true;
    } else {
      alert(data.message || "حدث خطأ أثناء الحفظ");
    }
  } catch (error) {
    console.error("خطأ في حفظ البيانات:", error);
    alert("فشل الاتصال بالسيرفر");
  }
}

// ✅ تفعيل تعديل الحقول
function enableEdit() {
  document.querySelectorAll('.info-pair input').forEach(input => input.disabled = false);
  document.getElementById('saveBtn').disabled = false;
}

// ✅ عرض إشعارات
// ✅ عرض إشعارات للمريض
function showNotifications() {
  alert("🔔 لا توجد إشعارات حالياً.\nسيتم إعلامك بأي تحديثات مستقبلية هنا.");
}


// ✅ تسجيل الخروج
function logout() {
  alert("✅ تم تسجيل الخروج");
  window.location.href = "/Login/Login.html";
}

// ✅ الترجمة
let currentLang = localStorage.getItem("lang") || "ar";
let translations = {};

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("lang", currentLang);
  updateLanguage();
  updateLangButton();
}

function loadLanguage() {
  fetch("lang-patient.json")
    .then(res => res.json())
    .then(data => {
      translations = data;
      updateLanguage();
      updateLangButton();
    })
    .catch(error => console.error("فشل تحميل الترجمة:", error));
}

function updateLanguage() {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[currentLang] && translations[currentLang][key]) {
      if (el.tagName === "INPUT") {
        el.placeholder = translations[currentLang][key];
      } else {
        el.textContent = translations[currentLang][key];
      }
    }
  });

  document.body.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
  document.documentElement.lang = currentLang;
}

function updateLangButton() {
  const btn = document.querySelector(".lang-btn");
  if (btn) {
    btn.innerHTML = `<i class="fas fa-globe"></i> ${currentLang === "ar" ? "عربي" : "English"}`;
  }
}
