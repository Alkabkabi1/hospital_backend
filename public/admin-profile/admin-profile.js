document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        alert("غير مصرح لك بالدخول هنا");
        window.location.href = "../Login/Login.html";
        return;
    }

    // عرض بيانات المشرف
    document.getElementById("adminName").value = user.name || "";
    document.getElementById("adminEmail").value = user.email || "";

    // تحميل صورة من localStorage إذا موجودة
    const savedImage = localStorage.getItem("adminProfileImage");
    if (savedImage) {
        document.getElementById("profileImage").src = savedImage;
    }

    // التعامل مع رفع صورة جديدة
    document.getElementById("profileImage").addEventListener("click", () => {
        document.getElementById("imageUpload").click();
    });

    document.getElementById("imageUpload").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                document.getElementById("profileImage").src = imageUrl;
                localStorage.setItem("adminProfileImage", imageUrl);
            };
            reader.readAsDataURL(file);
            fetch("/api/check-session", { credentials: "include" })
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
    });
});

// ✅ الترجمة
    // ======================
    let currentLang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "ar");
    let translations = {};

    function toggleLanguage() {
        currentLang = currentLang === "ar" ? "en" : "ar";
        localStorage.setItem("lang", currentLang);
        updateLanguage();
        updateLangButton();
    }

    function updateLangButton() {
        const btnText = document.getElementById("lang-text");
        if (btnText) {
            btnText.textContent = currentLang === 'ar' ? 'عربي' : 'English';
        }
    }

    function updateLanguage() {
        document.querySelectorAll("[data-key]").forEach(el => {
            const key = el.getAttribute("data-key");
            if (translations[currentLang] && translations[currentLang][key]) {
                if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                    el.placeholder = translations[currentLang][key];
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", currentLang);
    }

    fetch("lang-admin-profile.json") // ← اسم ملف الترجمة
        .then(res => res.json())
        .then(data => {
            translations = data;
            updateLanguage();
            updateLangButton();
        })
        .catch(err => console.error("خطأ في تحميل ملف الترجمة:", err));

    // جعل زر اللغة يعمل
    window.toggleLanguage = toggleLanguage;
;