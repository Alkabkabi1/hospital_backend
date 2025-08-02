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
