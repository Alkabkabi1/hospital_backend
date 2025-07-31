async function createAccount() {
  const msg = document.getElementById("msg");
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const pw = document.getElementById("password").value;
  const cpw = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value; // ✅ نوع المستخدم
  const remember = document.getElementById("remember").checked;

  if (!name || !phone || !email || !pw || !cpw) {
    return showMessage("error", langData[currentLang]["error_fill_fields"]);
  }

  if (pw.length < 8 || !/[A-Z]/.test(pw) || !/[!@#$%^&*]/.test(pw)) {
    return showMessage("error", langData[currentLang]["error_password_requirements"]);
  }

  if (pw !== cpw) {
    return showMessage("error", langData[currentLang]["error_password_match"]);
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, password: pw, role })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("success", langData[currentLang]["success_created"]);

      if (remember) {
        localStorage.setItem("userData", JSON.stringify({ name, phone, email }));
      }

      // ✅ حفظ الدور والانتقال للصفحة المناسبة
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      setTimeout(() => {
        if (role === "patient") {
          window.location.href = "/Patients/patient-profile.html";
        } else if (role === "staff") {
          window.location.href = "/Employees/employee-profile.html";
        } else {
          window.location.href = "/home3/home3.html"; // احتياطي
        }
      }, 1500);
    } else {
      showMessage("error", data.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  } catch (error) {
    console.error("Signup error:", error);
    showMessage("error", "فشل الاتصال بالخادم");
  }
}

function showMessage(type, text) {
  const msg = document.getElementById("msg");
  msg.className = `message ${type}`;
  msg.textContent = text;
  msg.style.display = "block";
}

// عند التحميل
window.onload = () => {
  const data = JSON.parse(localStorage.getItem("userData") || "{}");
  if (data.name) document.getElementById("fullName").value = data.name;
  if (data.phone) document.getElementById("phone").value = data.phone;
  if (data.email) document.getElementById("email").value = data.email;

  applyTranslations();
};

let currentLang = "ar";
let langData = {};

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations();
}

function applyTranslations() {
  fetch("lang-signup.json")
    .then((res) => res.json())
    .then((data) => {
      langData = data;
      const elements = document.querySelectorAll("[data-key]");
      elements.forEach((el) => {
        const key = el.getAttribute("data-key");
        if (data[currentLang][key]) el.textContent = data[currentLang][key];
      });

      const placeholders = document.querySelectorAll("[data-key-placeholder]");
      placeholders.forEach((el) => {
        const key = el.getAttribute("data-key-placeholder");
        if (data[currentLang][key]) el.placeholder = data[currentLang][key];
      });

      document.body.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
      document.documentElement.lang = currentLang;
    });
}
