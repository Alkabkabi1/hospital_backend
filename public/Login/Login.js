async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("يرجى إدخال البريد وكلمة المرور");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ تسجيل الدخول ناجح
      alert(data.message);

      // حفظ معلومات المستخدم مؤقتًا في localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ توجيه المستخدم حسب الدور
      if (data.user.role === "visitor") {
        window.location.href = "/Patients/patient-profile.html";
      } else if (data.user.role === "staff") {
        window.location.href = "/Employees/Employee-profile.html";
      } else if (data.user.role === "admin") {
        window.location.href = "/admin-profile/admin-profile.html";
      } else {
        alert("صلاحية غير معروفة");
      }

    } else {
      // ❌ رسالة خطأ من الخادم
      alert(data.message || "فشل تسجيل الدخول");
    }
  } catch (error) {
    console.error("خطأ:", error);
    alert("حدث خطأ أثناء الاتصال بالخادم");
  }
}

  // الترجمة

document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll("[data-key]");
  const buttons = document.querySelectorAll(".lang-btn");
  const savedLang = localStorage.getItem("lang") || "ar";

  function setLanguage(lang) {
    fetch("lang-login.json")
      .then((res) => res.json())
      .then((data) => {
        elements.forEach((el) => {
          const key = el.getAttribute("data-key");
          if (key && data[lang][key]) {
            // إذا كان العنصر input أو textarea يتم تعديل الـ placeholder
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
              el.setAttribute("placeholder", data[lang][key]);
            } else {
              el.textContent = data[lang][key];
            }
          }
        });

        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
        localStorage.setItem("lang", lang);
        updateButtonLabel(lang);
      });
  }

  function updateButtonLabel(lang) {
    buttons.forEach((btn) => {
      btn.innerHTML = `<i class="fas fa-globe"></i> ${lang === "ar" ? "English" : "عربي"}`;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newLang = localStorage.getItem("lang") === "ar" ? "en" : "ar";
      setLanguage(newLang);
    });
  });

  // تفعيل اللغة عند تحميل الصفحة
  setLanguage(savedLang);
});
