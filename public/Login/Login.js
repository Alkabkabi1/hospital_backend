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

      // توجيه حسب الدور
      if (data.user.role === "visitor") {
        window.location.href = "/patient-profile/patient-profile.html";
      } else if (data.user.role === "staff") {
        window.location.href = "/Employee-profile/Employee-profile.html";
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
