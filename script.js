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
  daySelect.value = i
  const selectedDisplay = document.getElementById('selectedDayDisplay')
  if (selectedDisplay) selectedDisplay.textContent = ` اليوم الحالي: ${i}`
  loadDayData(i)
  

 
  // بدلاً من الإغلاق، نوسّع القايمة
  toggleSidebar(); // دي أصلاً بتفتح وتقفل


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

  if (sidebar.classList.contains("open")) {
    // شيل الـ collapsed أول ما تتفتح
    sidebar.classList.remove("collapsed");
  } else {
    // ضيف الـ collapsed أول ما تتقفل
    sidebar.classList.add("collapsed");
  }
}





function toggleTasks() {
  const dropdown = document.getElementById('tasksDropdown')
  dropdown.classList.toggle('open')
  
  // أول ما أفتح المهام، أسمح للقايمة الجانبية بالتمدد
  const sidebar = document.getElementById('sidebar')
  sidebar.classList.remove('collapsed') 

  // تفريغ القائمة وبناء عناصر المهام زي ما عندك بالفعل
  const list = document.getElementById('tasksList')
  list.innerHTML = ''

  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`)
    if (data) {
      const d = JSON.parse(data)
      if (d.priority) {
        const li = document.createElement('li')
        const label = document.createElement('label')
        label.textContent = `اليوم ${i}`
        label.onclick = (e) => {
          e.preventDefault()
          alert(`مهام اليوم ${i}:\n${d.priority || 'لا توجد مهام مسجلة'}`)
        }
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = !!d.taskCompleted
        checkbox.onclick = (e) => {
          e.stopPropagation()
          d.taskCompleted = checkbox.checked
          localStorage.setItem(`ayoosh_day_${i}`, JSON.stringify(d))
        }

        li.appendChild(label)
        li.appendChild(checkbox)
        list.appendChild(li)
      }
    }
  }
}



function resetSidebarContent() {
  const dayList = document.getElementById('dayList')
  if (dayList) {
    // امسح القائمة
    dayList.innerHTML = ''

    // أعد توليد الأيام من الأول
    for (let i = 1; i <= 30; i++) {
      const li = document.createElement('li')
      li.textContent = ` اليوم ${i}`

      const savedData = localStorage.getItem(`ayoosh_day_${i}`)
      if (savedData) {
        li.style.backgroundColor = "#b9effff7"
      } else if ([7, 14, 21, 28].includes(i)) {
        li.style.fontWeight = "bold"
      }

      li.onclick = () => {
        document.getElementById('day').value = i
        loadDayData(i)
        const selectedDisplay = document.getElementById('selectedDayDisplay')
        if (selectedDisplay) {
          selectedDisplay.textContent = ` اليوم الحالي: ${i}`
        }
        toggleSidebar() // إغلاق القائمة بعد الاختيار
      }

      dayList.appendChild(li)
    }
  }
}






// حفظ البيانات
 async function saveData() {
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
  await showModal(
    "من فضلك املأ البيانات الأساسية.",
    [{ label: "طيب استنى", value: true }]
  );
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

// استدعاء المهام (لو فيه مكان بتضيف فيه مهام يومية)
const taskElements = document.querySelectorAll('.task input[type="checkbox"]');
const tasks = Array.from(taskElements).map(task => ({
  name: task.getAttribute('data-name') || 'مهمة',
  done: task.checked
}));

entry.tasks = tasks;





  // التخزين في localStorage
  localStorage.setItem(`ayoosh_day_${day}`, JSON.stringify(entry));
  await showModal(
  "تم حفظ اليوم بنجاح!",
  [{ label: " تم" , value: true }]
);

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


 async function deleteAllData() {
  const confirmDelete = await showModal(
  "هل أنت متأكد أنك تريد حذف جميع اليوميات؟ هذا لا يمكن التراجع عنه.",
  [
    { label: "أيوه، امسح 🗑️", value: true },
    { label: "لا ❌", value: false }
  ]
);

  if (confirmDelete) {
    for (let i = 1; i <= 30; i++) {
      localStorage.removeItem(`ayoosh_day_${i}`);
    }

// تصفير دائرة المشاعر
chart.data.labels = [];
chart.data.datasets[0].data = [];
chart.data.datasets[0].backgroundColor = [];
chart.options.plugins.legend.display = false;
chart.update();

// تغيير الرسالة
const messageElem = document.getElementById("feelingMessage");
if (messageElem) messageElem.textContent = "لا توجد بيانات لعرضها.";


    await showModal(
    "تم حذف جميع اليوميات بنجاح!",
    [{ label: "تم", value: true }]
  );


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
}, 10000); // بعد أول 10 ثواني من تحميل الصفحة

// دالة السؤال
 // دالة السؤال
// دالة السؤال
// دالة السؤال
async function askAboutYesterday(currentDay) {
  const previousDay = currentDay - 1;

  const data = localStorage.getItem(`ayoosh_day_${previousDay}`);
  if (!data) return; // مفيش بيانات لليوم السابق

  const d = JSON.parse(data);
  if (d.taskCompleted) return; // أصلًا مكتمل → مفيش سؤال

  // اسأل المستخدم
  const answer = await showModal(
    "أيوش انتهيتي من مهمة امبارح؟",
    [
      { label: "أه خلصتها ", value: true },
      { label: "لسه ", value: false }
    ]
  );

  if (answer) {
    // عدّل الحالة للمهمة
    d.taskCompleted = true;
    localStorage.setItem(`ayoosh_day_${previousDay}`, JSON.stringify(d));
    

    // رد إيجابي عشوائي
    const positiveResponses = [
      "ممتاز يا أشوش، أنا مبسوط منك 🌟",
      "هايل يا أيوش 💖",
      "أنتي أحسن حد بيعرف ينجّز مهامه 💪",
      "أنا مبسوط منك أوي 🥰"
    ];
    const randomPositive = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    await showModal(
      randomPositive,
      [{ label: "تمام ", value: true }]
    );

  } else {
    // رد سلبي عشوائي بدون تعديل الحالة
    const negativeResponses = [
      "ليه كده يا أيلو؟ طيب يلا نبدأ؟ 💭",
      "مفيش مشكلة، كلنا بتحصل لنا ظروف تعطّلنا 💜",
      "كنت فاكرك خلّصتيهم بصراحة ، بس مش مشكلة يلا ننجزهم الأول! ",
      "ما تقلقيش، نقدر نبدأ من جديد ونخلّصهم سوا 🤗"
    ];
    const randomNegative = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
    await showModal(
      randomNegative,
      [{ label: "تمام ", value: true }]
    );
  }
}



// أول ما الصفحة تفتح، نستنى 10 ثواني ثم نسأل مره واحده فقط
setTimeout(() => {
  const currentDay = parseInt(document.getElementById('day').value, 10) || 1;
  if (currentDay > 1) {
    askAboutYesterday(currentDay); // نسأل مره واحده فقط
  }
}, 10000); // بعد أول 10 ثواني من تحميل الصفحة




function showModal(message, buttons) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const messageElem = document.getElementById('modalMessage');
    const buttonsElem = document.getElementById('modalButtons');

    messageElem.textContent = message;
    buttonsElem.innerHTML = '';

    // لو مفيش أزرار نعرض الرسالة بدون أزرار ونرجع مباشرة
    if (!buttons || buttons.length === 0) {
      modal.style.display = 'flex';
      resolve(); // نرجع على طول عشان مفيش قيمة من أزرار
      return;
    }

    // لو فيه أزرار نبنيها عادي
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.label;
      button.onclick = () => {
        modal.style.display = 'none';
        resolve(btn.value); 
      };
      buttonsElem.appendChild(button);
    });

    modal.style.display = 'flex';
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const greetingMessages = [
    "عندنا يا ترى معانا إيه جديد النهاردة؟؟ ",
    "صباح الخير يا أحلى أيوش ",
    "اووه إيه الحلويات دي؟ أنا بفرح لما بشوفك اوي 🥰",
    "غيابك طول وحشتيني أوي 💜",
    "اووف ايه ده 🫣♥",

    
  ];

  const randomGreeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];

  setTimeout(() => {
    showModal(randomGreeting); // بدون أزرار
    setTimeout(() => {
      const modal = document.getElementById('customModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }, 3000); // يختفي بعد 4 ثواني
  }, 1000); // يظهر بعد ثانية من تحميل الصفحة
});

document.addEventListener('DOMContentLoaded', () => {
  // بنختار كل عناصر القايمة الرئيسية بدون شرط وجود "has-submenu"
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  sidebarItems.forEach(item => {
    const submenu = item.querySelector('.submenu');
    if (submenu) {
      item.addEventListener('click', (e) => {
        e.stopPropagation(); // نمنع انتشار الحدث
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
      });
    }
  });
});



let buttonsHidden = false;

document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const tasksDropdown = document.getElementById('tasksDropdown');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const tasksToggle = document.querySelector('.tasks-toggle');

  const clickedInsideSidebar = sidebar.contains(e.target) || sidebarToggle.contains(e.target);
  const clickedInsideTasks = tasksDropdown.contains(e.target) || tasksToggle.contains(e.target);

  const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'LABEL', 'A'];
  if (interactiveTags.includes(e.target.tagName)) return;

  if (clickedInsideSidebar || clickedInsideTasks) return;

  // نقفل القوائم فقط
  sidebar.classList.remove('open');
  tasksDropdown.classList.remove('open');
  tasksToggle.classList.remove('shifted');
});


const sidebarToggle = document.querySelector('.sidebar-toggle');
const tasksToggle = document.querySelector('.tasks-toggle');

let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
let scrollThreshold = 200; // المسافة اللي لازم يطلعها المستخدم عشان يظهر الزرار
let hideReferencePoint = lastScrollTop; // هنسجل منها نقطة النزول

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const sidebarOpen = document.getElementById('sidebar').classList.contains('open');
  const tasksOpen = document.getElementById('tasksDropdown').classList.contains('open');

  // ✅ لو المستخدم في أول الصفحة → نظهر الزرين على طول
  if (scrollTop === 0) {
    sidebarToggle.classList.remove('hidden-soft');
    tasksToggle.classList.remove('hidden-soft');
    return; // نخرج من الدالة
  }

  // لو القوائم مفتوحة → لا تخفي ولا تظهر الزرار
  if (sidebarOpen || tasksOpen) return;

  // المستخدم نازل ↓
  if (scrollTop > lastScrollTop) {
    hideReferencePoint = scrollTop;
    sidebarToggle.classList.add('hidden-soft');
    tasksToggle.classList.add('hidden-soft');
  }
  // المستخدم طالع ↑
  else if (scrollTop < lastScrollTop) {
    const scrolledUp = hideReferencePoint - scrollTop;
    if (scrolledUp > scrollThreshold) {
      sidebarToggle.classList.remove('hidden-soft');
      tasksToggle.classList.remove('hidden-soft');
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
