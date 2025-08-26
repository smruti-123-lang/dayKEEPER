// QUOTE SECTION
const quote = document.getElementById("quote");

quote.addEventListener("click", getquote);

function getquote() {
  fetch("quote.json")
    .then((res) => res.json())
    .then((data) => {
      const random = data[Math.floor(Math.random() * data.length)];
      document.getElementById("display").innerText = `"${random.content}" – ${random.author}`;
    })
    .catch((err) => {
      document.getElementById("display").innerText = "Could not fetch quote.";
      console.error("Error:", err);
    });
}

// CALENDAR SECTION
document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calender");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
     height: 420,
  });

  calendar.render();
});


//timer section
function updateTime() {
  const now = new Date();
  let h = String(now.getHours()).padStart(2, '0');
  let m = String(now.getMinutes()).padStart(2, '0');
  let s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('watch').innerText = `${h}:${m}:${s}`;
}

setInterval(updateTime, 1000);
updateTime(); // initial run


// stopwatch....

let stopwatchInterval;
let ms = 0, sec = 0, min = 0;

function startStopwatch() {
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      ms += 1;
      if (ms === 100) {
        ms = 0;
        sec += 1;
      }
      if (sec === 60) {
        sec = 0;
        min += 1;
      }

      document.getElementById("stopwatch").innerText =
        `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
    }, 10); // 10 milliseconds
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  ms = 0;
  sec = 0;
  min = 0;
  document.getElementById("stopwatch").innerText = "00:00:00";
}

// GRAPH
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];

// ✅ Initialize the Chart
const ctx = document.getElementById("myChart");
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Today"],
    datasets: [{
      label: "% of Daily Goal",
      data: [0],
      backgroundColor: "#00cc99",
      borderColor: "#008b6f",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: value => value + "%"
        }
      }
    }
  }
});

// ✅ Add Task and Update
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const taskItem = createTaskElement(taskText, false);
  taskList.appendChild(taskItem);

  tasks.push({ text: taskText, done: false });
  saveTasksToLocalStorage();
  taskInput.value = "";
  updateChart();
}

// ✅ Create Task Element (with checkbox)
function createTaskElement(text, isChecked) {
  const taskItem = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isChecked;
  checkbox.onchange = () => {
    const index = [...taskList.children].indexOf(taskItem);
    tasks[index].done = checkbox.checked;
    saveTasksToLocalStorage();
    updateChart();
  };

  const label = document.createElement("label");
  label.textContent = " " + text;

  taskItem.appendChild(checkbox);
  taskItem.appendChild(label);

  return taskItem;
}
function clearAllTasks() {
  tasks = [];
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  updateChart();
}

// ✅ Save to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Load on Page Load
function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = savedTasks;

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const taskItem = createTaskElement(task.text, task.done);
    taskList.appendChild(taskItem);
  });

  updateChart();
}

// ✅ Update Graph
function updateChart() {
  const goal = tasks.length;
  if (goal === 0) {
    myChart.data.datasets[0].data = [0];
    myChart.update();
    return;
  }

  let completed = 0;
  tasks.forEach(task => {
    if (task.done) completed++;
  });

  const percent = Math.round((completed / goal) * 100);
  myChart.data.datasets[0].data = [percent];
  myChart.update();
}

// ✅ Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);
