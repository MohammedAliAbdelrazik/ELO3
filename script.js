
window.onload = () => {
  const daySelect = document.getElementById("day");
  const dayList = document.getElementById("dayList");
  let firstEmptyDay = null;

  for (let i = 1; i <= 30; i++) {
    
    const option = document.createElement("option");
    option.value = i;
    option.textContent = ` اليوم ${i}`;
    daySelect.appendChild(option);

    
    const li = document.createElement("li");
    li.textContent = ` اليوم ${i}`;

   
    const savedData = localStorage.getItem(`ayoosh_day_${i}`);
    if (savedData) {
      li.style.backgroundColor = "#b9effff7"; 
    } else if (!firstEmptyDay) {
      firstEmptyDay = i;
    }

    
    if ([7, 14, 21, 28].includes(i)) {
      li.style.fontWeight = "bold";
    }

    li.onclick = () => {
  daySelect.value = i
  const selectedDisplay = document.getElementById('selectedDayDisplay')
  if (selectedDisplay) selectedDisplay.textContent = i;
  loadDayData(i)
  

 
  
  toggleSidebar(); 


    };

    dayList.appendChild(li);
  }

 
  if (firstEmptyDay) {
    daySelect.value = firstEmptyDay;
    const selectedDisplay = document.getElementById("selectedDayDisplay");
    if (selectedDisplay) {
      selectedDisplay.textContent = firstEmptyDay;
    }
    loadDayData(firstEmptyDay);
  }
};





function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");

  const tasksToggle = document.querySelector(".tasks-toggle");
  tasksToggle.classList.toggle("shifted"); 

  if (sidebar.classList.contains("open")) {
  
    sidebar.classList.remove("collapsed");
  } else {
    
    sidebar.classList.add("collapsed");
  }
}





function updateTasksDropdownPosition() {
  const dropdown = document.getElementById('tasksDropdown');
  const toggleBtn = document.querySelector('.tasks-toggle');

  if (!dropdown.classList.contains('open')) return;

  const rect = toggleBtn.getBoundingClientRect();
  const dropdownWidth = dropdown.offsetWidth;

  dropdown.style.position = 'absolute';
  dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;

 
  const centerX = rect.left + rect.width / 2;
  dropdown.style.left = `${centerX - dropdownWidth / 2 + window.scrollX}px`;
}


function toggleTasks() {
  const dropdown = document.getElementById('tasksDropdown');
  const toggleBtn = document.querySelector('.tasks-toggle');
  const list = document.getElementById('tasksList');

  
  if (dropdown.classList.contains('open')) {
    dropdown.classList.remove('open');
    return;
  }

  
  const rect = toggleBtn.getBoundingClientRect();
  const dropdownWidth = 220; 
  const top = rect.bottom + window.scrollY + 8;
  const left = rect.left + window.scrollX + (rect.width / 2) - (dropdownWidth / 2);

  dropdown.style.top = `${top}px`;
  dropdown.style.left = `${left}px`;

  
  dropdown.classList.add('open');
  updateTasksDropdownPosition(); 

  
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('collapsed');

  
  list.innerHTML = '';

  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      const d = JSON.parse(data);
      if (d.priority) {
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.textContent = `اليوم ${i}`;
        label.onclick = async (e) => {
          e.preventDefault();
          const message = d.priority
            ? `المهمة بتاعت اليوم ${i} هي:${d.priority}`
            : `مفيش مهمة مسجلة لليوم ${i}`;
          await showModal(message, [{ label: "ماشي", value: true }]);
        };

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

  if (list.children.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.textContent = "أيوش معندهاش مهام 😴";
    emptyMsg.style.padding = "10px";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.color = "#666";
    list.appendChild(emptyMsg);
  }
}

window.addEventListener('scroll', updateTasksDropdownPosition);
window.addEventListener('resize', updateTasksDropdownPosition);



function resetSidebarContent() {
  const dayList = document.getElementById('dayList')
  if (dayList) {
    
    dayList.innerHTML = ''

    
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
          selectedDisplay.textContent = i
        }
        toggleSidebar() 
      }

      dayList.appendChild(li)
    }
  }
}







 async function saveData() {
  const day = document.getElementById("day").value;
  const feeling = document.querySelector('input[name="feeling"]:checked')?.value || '';
  const notes = document.getElementById("notes").value;
  const priority = document.getElementById("priority").value;
  const event = document.getElementById("event").value;
  const feelInside = document.getElementById("feelInside").value;
  const morning = document.getElementById("morning").checked;
  const evening = document.getElementById("evening").checked;

  
  if (!day || !feeling || !notes) {
  await showModal(
    "  .معلش لازم تملي البيانات كلها الأول ",
    [{ label: " طيب. يارب صبرني", value: true }]
  );
  return;
}

  
  const now = new Date();
  const time = now.toLocaleTimeString('ar-EG');
  const date = now.toLocaleDateString('ar-EG');

  
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


const taskElements = document.querySelectorAll('.task input[type="checkbox"]');
const tasks = Array.from(taskElements).map(task => ({
  name: task.getAttribute('data-name') || 'مهمة',
  done: task.checked
}));

entry.tasks = tasks;





  
  localStorage.setItem(`ayoosh_day_${day}`, JSON.stringify(entry));
  await showModal(
  "اليوم اتحفظ بنجاح",
  [{ label: "ماشي" , value: true }]
);

  
  document.getElementById("notes").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("event").value = "";
  document.getElementById("feelInside").value = "";
  const checkedFeeling = document.querySelector('input[name="feeling"]:checked');
  if (checkedFeeling) checkedFeeling.checked = false;
  document.getElementById("morning").checked = false;
  document.getElementById("evening").checked = false;

  

  viewData(); 
  setTimeout(() => location.reload(), 500);

}

  

function viewData() {
  const output = document.getElementById("output");

  
  if (output.classList.contains("show")) {
  output.classList.remove("show");
  setTimeout(() => {
    output.innerHTML = "";
  }, 500);
  return;
}

  output.innerHTML = "<h3>اليوميات المحفوظة:</h3>";

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

  
  document.getElementById("notes").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("event").value = "";
  document.getElementById("feelInside").value = "";

  const feelings = document.querySelectorAll('input[name="feeling"]');
  feelings.forEach(input => input.checked = false);

  document.getElementById("morning").checked = false;
  document.getElementById("evening").checked = false;

  if (!data) {
    
    const selectedDisplay = document.getElementById("selectedDayDisplay");
    if (selectedDisplay) {
selectedDisplay.textContent = day;
    }
    document.getElementById("day").value = day;
    return;
  }

  
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
    selectedDisplay.textContent = day;
  }

  document.getElementById("day").value = day;
}


 async function deleteAllData() {
  const confirmDelete = await showModal(
  "متأكده أنك عايزه حذف جميع اليوميات؟ هذا لا يمكن التراجع عنه.",
  [
    { label: "أيوه، امسح", value: true, className: "danger-btn" },
    { label: " لا استنى ", value: false }
  ]
);


  if (confirmDelete) {
    for (let i = 1; i <= 30; i++) {
      localStorage.removeItem(`ayoosh_day_${i}`);
    }


if (typeof chart !== 'undefined' && chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[0].backgroundColor = [];
  chart.options.plugins.legend.display = false;
  chart.update();
}



const messageElem = document.getElementById("feelingMessage");
if (messageElem) messageElem.textContent = "لا توجد بيانات لعرضها.";


    await showModal(
    "الأيام كلها اتحذفت بنجاح",
    [{ label: "ماشي", value: true }]
  );


    
    viewData();
    setTimeout(() => location.reload(), 500);
  }
  

}


document.addEventListener("DOMContentLoaded", function () {
  const fields = ["notes", "priority", "event", "feelInside"];

  fields.forEach((id, index) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("keydown", function (e) {
        
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          
          if (index < fields.length - 1) {
            const nextEl = document.getElementById(fields[index + 1]);
            nextEl.focus();
          } else {
            
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

    
    const oldEmoji = label.querySelector(".feeling-emoji");
    if (oldEmoji) oldEmoji.remove();

    const emojiSpan = document.createElement("span");
    emojiSpan.textContent = emoji;
    emojiSpan.classList.add("feeling-emoji");
    label.appendChild(emojiSpan);

    
    setTimeout(() => {
      emojiSpan.classList.add("show");
    }, 10);

    
    setTimeout(() => {
      emojiSpan.classList.remove("show");
      setTimeout(() => emojiSpan.remove(), 500); 
    }, 2000);
  });
});

setTimeout(() => {
  const currentDay = parseInt(document.getElementById('day').value, 10) || 1;
  
  if (currentDay > 1) {
   
    askAboutYesterday(currentDay);
  }

  
  setInterval(() => {
    const currentDayRepeat = parseInt(document.getElementById('day').value, 10) || 1;
    if (currentDayRepeat > 1) {
      askAboutYesterday(currentDayRepeat);
    }
  }, 60000); // كل 60 ثانية
}, 10000); // بعد أول 10 ثواني من تحميل الصفحة


async function askAboutYesterday(currentDay) {
  const previousDay = currentDay - 1;

  const data = localStorage.getItem(`ayoosh_day_${previousDay}`);
  if (!data) return; 

  const d = JSON.parse(data);
  if (d.taskCompleted) return; 

  
  const answer = await showModal(
    "أيوش انتهيتي من المهام اللي عليكي؟",
    [
      { label: "أه خلصتها ", value: true },
      { label: "لسه ", value: false }
    ]
  );

  if (answer) {
    d.taskCompleted = true;
    localStorage.setItem(`ayoosh_day_${previousDay}`, JSON.stringify(d));
    

    const positiveResponses = [
      "كوتي كوتي أنتي خلصي مهامك 🥺",
      "أنتي أشطر كتكوت 💖",
      " أحسن حد بيعرف ينجز مهامه ",
      "أنا مبسوط منك أوي 🥰",
      "أنتي شطووره علطول "
    ];
    const randomPositive = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    await showModal(
      randomPositive,
      [{ label: "ماشي", value: true }]
    );

  } else {
    const negativeResponses = [
      "جدعة",
      "🤨🤨",
      "مبسوط منك🤨  ",
      "تماام ",

    ];
    const randomNegative = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
    await showModal(
      randomNegative,
      [{ label: "ماشي", value: true }]
    );
  }
}



setTimeout(() => {
  const currentDay = parseInt(document.getElementById('day').value, 10) || 1;
  if (currentDay > 1) {
    askAboutYesterday(currentDay); 
  }
}, 10000); 


function showWelcomeMessage(message) {
  const modal = document.getElementById('welcomeModal');
  const messageElem = document.getElementById('welcomeMessage');

  messageElem.textContent = message;
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add('show'), 10);

  setTimeout(() => {
    modal.classList.remove('show');
    setTimeout(() => (modal.style.display = "none"), 500);
  }, 6000);
}

document.addEventListener('DOMContentLoaded', () => {
  const greetingMessages = [
    "يارب يومك كله يبقى حنية زي قلبك ❤",
    "صباح الخير يا وش السعد ❤ ",
    "اوووه إيه الحلويات دي؟ أنا بفرح لما بشوفك أوي 🥰",
    "غيابك طول وحشتيني أوي 💜",
    "هو في حلاويات أكثر من كده؟؟ 😍",
    "فين الجميل من بدري ؟",
    "أيووووه كده نورت الدنيا كلها 🥰",
    "فينك من بدري؟ كنت مستنيكي 🤨",
  ];
  const randomGreeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];

 setTimeout(() => {
  const lastShown = localStorage.getItem("welcome_shown_at");
  const now = Date.now();

  if (!lastShown || now - parseInt(lastShown) > 20 * 60 * 60 * 1000  ) { 
    showWelcomeMessage(randomGreeting);
    localStorage.setItem("welcome_shown_at", now);
  }
}, 3000);

});


function showModal(message, buttons) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const messageElem = document.getElementById('modalMessage');
    const buttonsElem = document.getElementById('modalButtons');

    messageElem.textContent = message;
    buttonsElem.innerHTML = '';

    if (!buttons || buttons.length === 0) {
      modal.style.display = 'flex';
      resolve();
      return;
    }

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.label;
      
      if (btn.className) {
        button.classList.add(btn.className);
      }

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
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  sidebarItems.forEach(item => {
    const submenu = item.querySelector('.submenu');
    if (submenu) {
      item.addEventListener('click', (e) => {
        e.stopPropagation(); 
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
  const output = document.getElementById('output');

  const clickedInsideSidebar = sidebar.contains(e.target) || sidebarToggle.contains(e.target);
  const clickedInsideTasks = tasksDropdown.contains(e.target) || tasksToggle.contains(e.target);
  const clickedInsideOutput = output.contains(e.target);
  const clickedInsideDayEntry = e.target.closest('.day-entry') !== null;

  const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'LABEL', 'A'];
  if (interactiveTags.includes(e.target.tagName)) return;

  if (clickedInsideSidebar || clickedInsideTasks || clickedInsideOutput || clickedInsideDayEntry) return;

  sidebar.classList.remove('open');
  tasksDropdown.classList.remove('open');
  tasksToggle.classList.remove('shifted');

  if (output.classList.contains('show')) {
    output.classList.remove('show');
    setTimeout(() => output.innerHTML = '', 400);
  }
});



const sidebarToggle = document.querySelector('.sidebar-toggle');
const tasksToggle = document.querySelector('.tasks-toggle');
const ayooshBadge = document.querySelector('.ayoosh-badge');

let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
let scrollThreshold = 200; 
let hideReferencePoint = lastScrollTop;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const sidebarOpen = document.getElementById('sidebar').classList.contains('open');
  const tasksOpen = document.getElementById('tasksDropdown').classList.contains('open');

  if (scrollTop === 0) {
    sidebarToggle.classList.remove('hidden-soft');
    tasksToggle.classList.remove('hidden-soft');
    if (ayooshBadge) ayooshBadge.style.opacity = '1';
    return;
  }

  if (sidebarOpen || tasksOpen) return;

  if (scrollTop > lastScrollTop) {
    hideReferencePoint = scrollTop;
    sidebarToggle.classList.add('hidden-soft');
    tasksToggle.classList.add('hidden-soft');
    if (ayooshBadge) ayooshBadge.style.opacity = '0';
  }
  else if (scrollTop < lastScrollTop) {
    const scrolledUp = hideReferencePoint - scrollTop;
    if (scrolledUp > scrollThreshold) {
      sidebarToggle.classList.remove('hidden-soft');
      tasksToggle.classList.remove('hidden-soft');
    }
    if (scrollTop < 100 && ayooshBadge) ayooshBadge.style.opacity = '1';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});




function showTaskMessage(message) {
  const modal = document.getElementById("taskModal");
  const modalText = document.getElementById("taskModalText");

  modalText.textContent = message;
  modal.style.display = "flex";
}

function closeTaskModal() {
  const modal = document.getElementById("taskModal");
  modal.style.display = "none";
}

function showAppPrompt() {
  const prompt = document.getElementById('appPrompt');
  prompt.classList.add('show');

  setTimeout(() => {
    prompt.classList.remove('show');
  }, 6000);

  const now = Date.now();
  localStorage.setItem('last_app_prompt_time', now);
}

function hideAppPrompt() {
  document.getElementById('appPrompt').classList.remove('show');
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const lastShown = localStorage.getItem('last_app_prompt_time');
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) >= 3 * 60 * 60 * 1000) {
      showAppPrompt();
    }
  }, 500); 
});

