// توليد الأيام تلقائيًا
// توليد الأيام في القائمة الجانبية
window.onload = () => {
  const daySelect = document.getElementById("day");
  const dayList = document.getElementById("dayList");

  for (let i = 1; i <= 30; i++) {
  // إنشاء عنصر option للقائمة المخفية
  const option = document.createElement("option");
  option.value = i;
  option.textContent = ` اليوم ${i}`;
  daySelect.appendChild(option);

  // إنشاء عنصر li للقائمة الجانبية
  const li = document.createElement("li");
  li.textContent = ` اليوم ${i}`;

  // ✅ تمييز الأيام اللي فيها بيانات
  const existingData = localStorage.getItem(`ayoosh_day_${i}`);
  if (existingData) {
    li.classList.add("has-data"); // نضيف كلاس للتلوين
  }

  // ✅ تمييز الأيام المهمة (7، 14، 21، 28)
  if ([7, 14, 21, 28].includes(i)) {
    li.classList.add("bold-day");
  }

  // عند الضغط على اليوم
  li.onclick = () => {
    daySelect.value = i;

    const selectedDisplay = document.getElementById("selectedDayDisplay");
    if (selectedDisplay) {
      selectedDisplay.textContent = ` اليوم الحالي: ${i}`;
    }

    loadDayData(i);
    toggleSidebar();
  };

  dayList.appendChild(li);
}
};

// فتح/إغلاق القائمة الجانبية
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

// حفظ البيانات
function saveData() {
  const day = document.getElementById("day").value;
  const feeling = document.querySelector('input[name="feeling"]:checked')?.value || '';
  const notes = document.getElementById("notes").value;
  const priority = document.getElementById("priority").value;
  const event = document.getElementById("event").value;
  const feelInside = document.getElementById("feelInside").value;
  const morning = document.getElementById("morning").checked;
  const evening = document.getElementById("evening").checked;

  // التحقق من البيانات الأساسية
  if (!day || !feeling || !notes) {
    alert("من فضلك املأ البيانات الأساسية.");
    return;
  }

  // التاريخ والوقت الحالي
  const now = new Date();
  const time = now.toLocaleTimeString('ar-EG');
  const date = now.toLocaleDateString('ar-EG');

  // البيانات المراد حفظها
  const entry = {
    day,
    feeling,
    notes,
    priority,
    event,
    feelInside,
    azkar: {
      morning,
      evening
    },
    date,
    time
  };

  // التخزين في localStorage
  localStorage.setItem(`ayoosh_day_${day}`, JSON.stringify(entry));
  alert("تم حفظ اليوم بنجاح!");

  // إعادة تعيين الحقول
  document.getElementById("notes").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("event").value = "";
  document.getElementById("feelInside").value = "";
  const checkedFeeling = document.querySelector('input[name="feeling"]:checked');
  if (checkedFeeling) checkedFeeling.checked = false;
  document.getElementById("morning").checked = false;
  document.getElementById("evening").checked = false;

  viewData(); // علشان يحدث القائمة فورًا
}

  
// عرض البيانات
function viewData() {
  const output = document.getElementById("output");

  // إغلاق العرض إن كان مفتوح
  if (output.classList.contains("show")) {
  output.classList.remove("show");
  setTimeout(() => {
    output.innerHTML = "";
  }, 500);
  return;
}

  output.innerHTML = "<h3>📋 اليوميات المحفوظة:</h3>";

  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      const d = JSON.parse(data);

      const azkarList = [];
      if (d.azkar?.morning) azkarList.push("أذكار الصباح");
      if (d.azkar?.evening) azkarList.push("أذكار المساء");
      const azkarText = azkarList.length > 0 ? azkarList.join(" و ") : "لم تُحدد";

      const dayBox = document.createElement("div");
      dayBox.className = "day-entry";

      const header = document.createElement("div");
      header.className = "day-header";
      header.textContent =` اليوم ${d.day}`;

      const details = document.createElement("div");
      details.className = "day-details";
      details.innerHTML = `
        🕒 التاريخ: ${d.date} - الوقت: ${d.time}<br>
        😌 الشعور: ${d.feeling}<br>
        📝 الملاحظات: ${d.notes}<br>
        ✅ الأولويات: ${d.priority || '---'}<br>
        📌 الموقف: ${d.event || '---'}<br>
        💬 الفضفضة: ${d.feelInside || '---'}<br>
        🌤 الأذكار: ${azkarText}
      `;

      // التحكم في الفتح والإغلاق
      header.onclick = () => {
        details.style.display = details.style.display === "block" ? "none" : "block";
      };

      dayBox.appendChild(header);
      dayBox.appendChild(details);
      output.appendChild(dayBox);
    }
  }

  output.style.display = "block";
  setTimeout(() => {
    output.classList.add("show");
  }, 10);
}
function loadDayData(day) {
  const data = localStorage.getItem(`ayoosh_day_${day}`);

  // 🟡 فضي الحقول الأول
  document.getElementById("notes").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("event").value = "";
  document.getElementById("feelInside").value = "";

  const feelings = document.querySelectorAll('input[name="feeling"]');
  feelings.forEach(input => input.checked = false);

  document.getElementById("morning").checked = false;
  document.getElementById("evening").checked = false;

  if (!data) {
    // لو مفيش بيانات، بس اعرض اليوم الحالي فقط
    const selectedDisplay = document.getElementById("selectedDayDisplay");
    if (selectedDisplay) {
      selectedDisplay.textContent =` اليوم الحالي: ${day}`;
    }
    document.getElementById("day").value = day;
    return;
  }

  // ✅ لو فيه بيانات، املأها
  const d = JSON.parse(data);

  document.getElementById("notes").value = d.notes || "";
  document.getElementById("priority").value = d.priority || "";
  document.getElementById("event").value = d.event || "";
  document.getElementById("feelInside").value = d.feelInside || "";

  feelings.forEach(input => {
    input.checked = input.value === d.feeling;
  });

  document.getElementById("morning").checked = !!(d.azkar && d.azkar.morning);
  document.getElementById("evening").checked = !!(d.azkar && d.azkar.evening);

  const selectedDisplay = document.getElementById("selectedDayDisplay");
  if (selectedDisplay) {
    selectedDisplay.textContent =` اليوم الحالي: ${day}`;
  }

  document.getElementById("day").value = day;
}


function deleteAllData() {
  const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف جميع اليوميات؟ هذا لا يمكن التراجع عنه.");

  if (confirmDelete) {
    for (let i = 1; i <= 30; i++) {
      localStorage.removeItem(`ayoosh_day_${i}`);
    }

    alert("تم حذف جميع اليوميات بنجاح!");

    // إعادة تحديث العرض (لو القائمة مفتوحة)
    viewData();
  }
}
