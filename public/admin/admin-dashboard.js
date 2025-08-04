document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("غير مصرح لك بالدخول هنا");
    window.location.href = "../Login/Login.html";
    return;
  }

  // ✅ تحميل صورة من localStorage إذا موجودة
  const savedImage = localStorage.getItem("adminProfileImage");
  if (savedImage) {
    const profileImage = document.getElementById("profileImage");
    if (profileImage) profileImage.src = savedImage;
  }

  // ✅ التعامل مع رفع صورة جديدة
  const profileImage = document.getElementById("profileImage");
  const imageUpload = document.getElementById("imageUpload");

  if (profileImage && imageUpload) {
    profileImage.addEventListener("click", () => {
      imageUpload.click();
    });

    imageUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result;
          profileImage.src = imageUrl;
          localStorage.setItem("adminProfileImage", imageUrl);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ✅ عند الضغط على زر إضافة السياسة
  document.getElementById("policyForm").addEventListener("submit", function (e) {
    e.preventDefault();
    submitPolicy();
  });

  // ✅ دالة إرسال السياسة إلى السيرفر
  function submitPolicy() {
  const title = document.getElementById("policyTitle").value.trim();
  const content = document.getElementById("policyContent").value.trim();
  const description = document.getElementById("policyDescription").value.trim();
  const category = document.getElementById("policyCategory").value;
  const icon = document.getElementById("policyIcon").value.trim();
  const pdf_link = document.getElementById("policyPDF").value.trim();
  const qr_link = document.getElementById("policyQR").value.trim();
  const effective_date = document.getElementById("policyDate").value;

  if (!title || !description || !category || !icon) {
    alert("❌ يرجى تعبئة الحقول المطلوبة.");
    return;
  }

  const payload = {
    title,
    content,
    description,
    category,
    icon,
    pdf_link,
    qr_link,
    effective_date
  };

  console.log("🚀 إرسال السياسة:", payload); // تتبع التصحيح

  fetch("/api/admin/policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "✅ تمت إضافة السياسة بنجاح.");
      document.getElementById("policyForm").reset();
    })
    .catch(err => {
      console.error("❌ خطأ في الإرسال:", err);
      alert("❌ حدث خطأ أثناء إرسال السياسة.");
    });
  }
})