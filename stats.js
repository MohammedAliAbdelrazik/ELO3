window.onload = () => {
  const feelingsCount = {};
  const tasksDone = { done: 0, total: 0 };

  for (let i = 1; i <= 30; i++) {
    const data = localStorage.getItem(`ayoosh_day_${i}`);
    if (data) {
      try {
        const dayData = JSON.parse(data);
        if (dayData.feeling) {
          feelingsCount[dayData.feeling] = (feelingsCount[dayData.feeling] || 0) + 1;
        }
        if (dayData.tasks && dayData.tasks.length > 0) {
          tasksDone.total++;
          if (dayData.tasks.every(t => t.done)) {
            tasksDone.done++;
          }
        }
      } catch {}
    }
  }

  // عرض نسبة المهام
  const percent = tasksDone.total ? Math.round((tasksDone.done / tasksDone.total) * 100) : 0;
  document.getElementById("taskProgress").value = percent;
  document.getElementById("taskText").textContent = `تم إنجاز ${percent}% من المهام.`;


  // عرض دائرة المشاعر
  const labels = Object.keys(feelingsCount);
  const data = labels.map(label => feelingsCount[label]);

  const backgroundColors = {
    "سعيد": "#f1c40f",
    "حزين": "#3498db",
    "غاضب": "#e74c3c",
    "قلق": "#9b59b6",
    "متحمس": "#2ecc71",
    "محبط": "#95a5a6",
    "مرتاح": "#1abc9c"
  };

  const chart = new Chart(document.getElementById("feelingsChart"), {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map(l => backgroundColors[l] || "#ccc")
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // تحليل المشاعر
  let mostFrequent = null;
  let max = 0;
  for (const [feeling, count] of Object.entries(feelingsCount)) {
    if (count > max) {
      mostFrequent = feeling;
      max = count;
    }
  }

  const messages = {
    "حزين": "💔 يحزنني أنه غلب عليك طابع الحزن الثلاثين يوم الماضية، لماذا أنت حزين؟!",
    "سعيد": "😊 يبدو أنك عشت أيامًا مليئة بالبهجة والسعادة! استمر في ذلك!",
    "غاضب": "😠 لاحظت أن الغضب كان شعورًا متكررًا، هل هناك ما يثير انزعاجك باستمرار؟",
    "قلق": "😟 يبدو أن القلق كان يرافقك كثيرًا، حاول تخصيص وقت للاسترخاء.",
    "متحمس": "🔥 رائع! يبدو أنك كنت مليئًا بالحماس والطاقة!",
    "محبط": "😞 شعور الإحباط ليس سهلًا، حاول أن تمنح نفسك فرصة وتفاؤل.",
    "مرتاح": "😌 جميل أنك كنت تشعر بالراحة، استمر في الحفاظ على هذا السلام الداخلي."
  };

  if (mostFrequent && messages[mostFrequent]) {
    document.getElementById("emotionMessage").textContent = messages[mostFrequent];
  }
};

  function goBack() {
    window.location.href = 'index.html'; // اسم صفحتك الرئيسية
  }

