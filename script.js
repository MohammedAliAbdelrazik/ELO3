// توليد الأيام تلقائيًا
// توليد الأيام في القائمة الجانبية
window.onload = () => {
  const daySelect = document.getElementById("day");
  const dayList = document.getElementById("dayList");

  for (let i = 1; i <= 30; i++) {
    // إنشاء عنصر option للقائمة المخفية
    const option = document.createElement("option");
    option.value = i;
    option.textContent =` اليوم ${i}`;
    daySelect.appendChild(option);

    // إنشاء عنصر li للقائمة الجانبية
    const li = document.createElement("li");
    li.textContent =` اليوم ${i}`;
    
    li.onclick = () => {
      // تحديث قيمة السيلكت المخفي
      daySelect.value = i;

      // عرض اليوم الحالي في الصفحة
      const selectedDisplay = document.getElementById("selectedDayDisplay");
      if (selectedDisplay) {
        selectedDisplay.textContent =` اليوم الحالي: ${i}`;
      }

      // تحميل بيانات اليوم إذا كانت موجودة
      loadDayData(i);

      // إغلاق القائمة الجانبية
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
}

  
// عرض البيانات
function viewData() {
  const output = document.getElementById("output");
  output.innerHTML = "<h3>📋 اليوميات المحفوظة:</h3>";

  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      const d = JSON.parse(data);

      // تجهيز بيانات الأذكار
      const azkarList = [];
      if (d.azkar?.morning) azkarList.push("أذكار الصباح");
      if (d.azkar?.evening) azkarList.push("أذكار المساء");
      const azkarText = azkarList.length > 0 ? azkarList.join(" و ") : "لم تُحدد";

      output.innerHTML += `
        <div style="margin-bottom: 20px; padding: 10px; background: #f1f2f6; border-radius: 10px;">
          <strong>اليوم ${d.day}</strong><br>
          🕒 التاريخ: ${d.date} - الوقت: ${d.time}<br>
          😌 الشعور: ${d.feeling}<br>
          📝 الملاحظات: ${d.notes}<br>
          ✅ الأولويات: ${d.priority || '---'}<br>
          📌 الموقف: ${d.event || '---'}<br>
          💬 الفضفضة: ${d.feelInside || '---'}<br>
          🌤 الأذكار: ${azkarText}
        </div>
      `;
    }
  }
}

function loadDayData(day) {
  const data = localStorage.getItem(`ayoosh_day_${day}`);
  if (!data) {
    alert("لا توجد بيانات محفوظة لهذا اليوم.");
    return;
  }

  const d = JSON.parse(data);

  // تعبئة الحقول النصية
  document.getElementById("notes").value = d.notes || "";
  document.getElementById("priority").value = d.priority || "";
  document.getElementById("event").value = d.event || "";
  document.getElementById("feelInside").value = d.feelInside || "";

  // تحديد الشعور المختار
  const feelings = document.querySelectorAll('input[name="feeling"]');
  feelings.forEach(input => {
    input.checked = input.value === d.feeling;
  });

  // تحديد الأذكار
  document.getElementById("morning").checked = !!(d.azkar && d.azkar.morning);
  document.getElementById("evening").checked = !!(d.azkar && d.azkar.evening);

  // عرض اليوم الحالي
  const selectedDisplay = document.getElementById("selectedDayDisplay");
  if (selectedDisplay) {
    selectedDisplay.textContent =` اليوم الحالي: ${day}`;
  }

  // تحديث قيمة الـ select المخفي
  document.getElementById("day").value = day;
}