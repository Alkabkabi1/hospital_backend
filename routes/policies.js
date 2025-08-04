document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();

  const policyForm = document.getElementById("policyForm");
  const serviceForm = document.getElementById("serviceForm");

  policyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitPolicy();
  });

  serviceForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitService();
  });
});

function checkAdminAccess() {
  fetch("/api/check-session")
    .then(res => res.json())
    .then(data => {
      if (data.user?.role !== "admin") {
        alert("هذه الصفحة مخصصة للمشرف فقط.");
        window.location.href = "/public/home/home.html";
      }
    })
    .catch(() => {
      alert("حدث خطأ أثناء التحقق من الجلسة.");
      window.location.href = "/public/home/home.html";
    });
}

function submitPolicy() {
  const title = document.getElementById("policyTitle").value.trim();
  const description = document.getElementById("policyDescription").value.trim();
  const category = document.getElementById("policyCategory").value.trim();
  const icon = document.getElementById("policyIcon").value.trim();
  const pdf_link = document.getElementById("policyPDF").value.trim();
  const qr_link = document.getElementById("policyQR").value.trim();
  const effective_date = document.getElementById("policyDate").value;

  if (!title || !description || !category) {
    alert("يرجى تعبئة الحقول الإلزامية: العنوان والوصف والتصنيف.");
    return;
  }

  fetch("/api/admin/policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      category,
      icon: icon || "📄",
      pdf_link,
      qr_link,
      effective_date
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "تمت إضافة السياسة بنجاح.");
      document.getElementById("policyForm").reset();
    })
    .catch(() => alert("حدث خطأ أثناء إرسال السياسة."));
}

function submitService() {
  const title = document.getElementById("serviceTitle").value.trim();
  const desc = document.getElementById("serviceDesc").value.trim();
  const link = document.getElementById("serviceLink").value.trim();
  const target = document.getElementById("serviceTarget").value;

  if (!title || !desc || !link || !target) {
    alert("يرجى تعبئة جميع الحقول الخاصة بالخدمة.");
    return;
  }

  fetch("/api/admin/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: desc, link, target })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "تمت إضافة الخدمة بنجاح.");
      document.getElementById("serviceForm").reset();
    })
    .catch(() => alert("حدث خطأ أثناء إرسال الخدمة."));
}
