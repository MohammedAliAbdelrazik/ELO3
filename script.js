// توليد الأيام تلقائيًا
// توليد الأيام في القائمة الجانبية
window.onload = () => {
  const daySelect = document.getElementById("day");
  const dayList = document.getElementById("dayList");
  let firstEmptyDay = null;

  for (let i = 1; i <= 30; i++) {
    // إنشاء عنصر option للقائمة المخفية
    const option = document.createElement("option");
    option.value = i;
    option.textContent = ` اليوم ${i}`;
    daySelect.appendChild(option);

    // إنشاء عنصر li للقائمة الجانبية
    const li = document.createElement("li");
    li.textContent = ` اليوم ${i}`;

    // تلوين الأيام اللي فيها بيانات
    const savedData = localStorage.getItem(`ayoosh_day_${i}`);
    if (savedData) {
      li.style.backgroundColor = "#b9effff7"; // لون هادي
    } else if (!firstEmptyDay) {
      firstEmptyDay = i;
    }

    // تحديد الأيام 7 و14 و21 و28 بخط بولد
    if ([7, 14, 21, 28].includes(i)) {
      li.style.fontWeight = "bold";
    }

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

  // التوجيه تلقائي لأول يوم فاضي
  if (firstEmptyDay) {
    daySelect.value = firstEmptyDay;
    const selectedDisplay = document.getElementById("selectedDayDisplay");
    if (selectedDisplay) {
      selectedDisplay.textContent = ` اليوم الحالي: ${firstEmptyDay}`;
    }
    loadDayData(firstEmptyDay);
  }
};





// فتح/إغلاق القائمة الجانبية
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");

  const tasksToggle = document.querySelector(".tasks-toggle");
  tasksToggle.classList.toggle("shifted"); // ده الكلاس الجديد
}

function toggleTasks() {
  const dropdown = document.getElementById('tasksDropdown');
  dropdown.classList.toggle('open');

  // تفريغ القائمة
  const list = document.getElementById('tasksList');
  list.innerHTML = '';

  // جلب الأيام المسجلة
  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      const d = JSON.parse(data);
      if (d.priority) {
        const li = document.createElement('li');

        // اسم اليوم
        const label = document.createElement('label');
        label.textContent = `اليوم ${i}`;
        label.onclick = (e) => {
          e.preventDefault();
          alert(`مهام اليوم ${i}:\n${d.priority || 'لا توجد مهام مسجلة'}`);
        };

        // مربع اختيار مكتمل؟
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!d.taskCompleted;
        checkbox.onclick = (e) => {
          e.stopPropagation();
          d.taskCompleted = checkbox.checked;
          localStorage.setItem(`ayoosh_day_${i}`, JSON.stringify(d));
        };

        li.appendChild(label);
        li.appendChild(checkbox);
        list.appendChild(li);
      }
    }
  }
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
         الشعور: ${d.feeling}<br>
         الملاحظات: ${d.notes}<br>
         الأولويات: ${d.priority || '---'} ${d.taskCompleted ? '<span style="color:green; font-weight:bold;">(مكتملة ✅)</span>' : ''}<br>
         الموقف: ${d.event || '---'}<br>
         الفضفضة: ${d.feelInside || '---'}<br>
         الأذكار: ${azkarText}
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

document.addEventListener("DOMContentLoaded", function () {
  const fields = ["notes", "priority", "event", "feelInside"];

  fields.forEach((id, index) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("keydown", function (e) {
        // لو ضغط Enter من غير Shift
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          // لو مش آخر خانة → روح للي بعدها
          if (index < fields.length - 1) {
            const nextEl = document.getElementById(fields[index + 1]);
            nextEl.focus();
          } else {
            // لو آخر خانة → سجل البيانات
            saveData();
          }
        }
      });
    }
  });
});

const feelingEmojis = {
  "السعادة": "😊",
  "الحزن": "😢",
  "الخوف": "😱",
  "الفراغ": "😶",
  "التفاؤل": "🌈",
  "الندم": "😔",
  "الغضب": "😡",
  "الهدوء": "😌"
};

document.querySelectorAll('input[name="feeling"]').forEach(input => {
  input.addEventListener("change", () => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    const emoji = feelingEmojis[input.value];

    if (!label) return;

    // إزالة أي إيموجي قديم
    const oldEmoji = label.querySelector(".feeling-emoji");
    if (oldEmoji) oldEmoji.remove();

    // إنشاء إيموجي جديد
    const emojiSpan = document.createElement("span");
    emojiSpan.textContent = emoji;
    emojiSpan.classList.add("feeling-emoji");
    label.appendChild(emojiSpan);

    // إزالة بعد ثانيتين (احتياطي)
    setTimeout(() => {
      emojiSpan.remove();
    }, 2000);
  });
});

// أول ما الصفحة تفتح، نستنى ٥ ثواني قبل أول سؤال
setTimeout(() => {
  const currentDay = parseInt(document.getElementById('day').value, 10) || 1;
  
  if (currentDay > 1) {
    // اسأل أول مره
    askAboutYesterday(currentDay);
  }

  // وبعدين كرر السؤال كل دقيقة
  setInterval(() => {
    const currentDayRepeat = parseInt(document.getElementById('day').value, 10) || 1;
    if (currentDayRepeat > 1) {
      askAboutYesterday(currentDayRepeat);
    }
  }, 60000); // كل 60 ثانية
}, 5000); // بعد أول ٥ ثواني من تحميل الصفحة

// دالة السؤال
function askAboutYesterday(currentDay) {
  const previousDay = currentDay - 1;
  const answer = confirm('أيوش انتهيتي من مهمة امبارح؟ اضغطي "موافق" إذا أه، و "إلغاء" إذا لسه.');
  if (answer) {
    const data = localStorage.getItem(`ayoosh_day_${previousDay}`);
    if (data) {
      const d = JSON.parse(data);
      d.taskCompleted = true;
      localStorage.setItem(`ayoosh_day_${previousDay}`, JSON.stringify(d));
      alert(`✅ تم تعليم مهمة اليوم ${previousDay} كمكتملة!`);
    } else {
      alert(`⚠ مفيش بيانات محفوظة لليوم ${previousDay}.`);
    }
  }
}

function checkUncompletedTasks() {
  const currentDay = parseInt(document.getElementById('day').value, 10) || 1;
  if (currentDay <= 1) return; // مفيش أيام سابقة

  // هنجمع الأيام غير المكتملة
  const incompleteDays = [];
  for (let i = 1; i < currentDay; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      const d = JSON.parse(data);
      if (!d.taskCompleted) {
        incompleteDays.push(i);
      }
    }
  }

  // لو مفيش أيام غير مكتملة، مفيش سؤال
  if (incompleteDays.length === 0) return;

  // حضّر نص الأيام
  const daysList = incompleteDays.map(d => `اليوم ${d}`).join(' و ');

  const answer = confirm(`أيوش انتهيتي من المهام اللي عندك في ${daysList}؟ اضغطي "موافق" إذا أه، و "إلغاء" إذا لسه.`);

  const positiveResponses = [
    "ممتاز يا أشوش، أنا مبسوط منك! 🌟",
    "هايل يا أيوش! 💖",
    "أنتي أحسن حد بيعرف ينجّز مهامه! 💪",
    "أنا مبسوط منك أوي! 🥰"
  ];
  const negativeResponses = [
    "ليه كده يا أيلو؟ طيب يلا نبدأ؟ 💭",
    "مافيش مشكلة، كلنا بتحصل لنا ظروف تعطّلنا 💜",
    "كنت فاكرك خلّصتيهم يا أيوش، بس يلا ننجزهم الأول! ✨",
    "ما تقلقيش، نقدر نبدأ من جديد ونخلّصهم سوا 🤗"
  ];

  if (answer) {
    // علم الأيام كمكتملة
    incompleteDays.forEach(dayNum => {
      const data = localStorage.getItem(`ayoosh_day_${dayNum}`);
      if (data) {
        const d = JSON.parse(data);
        d.taskCompleted = true;
        localStorage.setItem(`ayoosh_day_${dayNum}`, JSON.stringify(d));
      }
    });

    alert(`✅ تم تعليم المهام كمكتملة لـ ${daysList}.`);
    const randomPositive = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    alert(randomPositive);
  } else {
    const randomNegative = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
    alert(randomNegative);
  }
}

setTimeout(() => {
  checkUncompletedTasks();
  setInterval(() => checkUncompletedTasks(), 60000); // كل 60 ثانية
}, 5000); // بعد أول 5 ثواني من تحميل الصفحة
