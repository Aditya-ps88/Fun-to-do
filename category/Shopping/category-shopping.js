document.addEventListener("DOMContentLoaded", () => {
  const category = "Shopping";
  const tasksKey = "tasks";
  let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

  const taskListEl = document.getElementById("task-list");
  const completedListEl = document.getElementById("completed-list");
  const textInput = document.getElementById("task-text");
  const dateInput = document.getElementById("task-date");

  function saveTasks() {
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
  }

  function render() {
    taskListEl.innerHTML = "";
    completedListEl.innerHTML = "";

    const pending = tasks.filter(t => t.category === category && !t.completed);
    const completed = tasks.filter(t => t.category === category && t.completed);

    pending.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-card";

      const textArea = document.createElement("textarea");
      textArea.className = "task-edit";
      textArea.value = task.text;
      textArea.addEventListener("change", (e) => {
        tasks[tasks.indexOf(task)].text = e.target.value;
        saveTasks();
      });

      const dateEl = document.createElement("input");
      dateEl.type = "date";
      dateEl.className = "task-date";
      dateEl.value = task.date || "";
      dateEl.addEventListener("change", (e) => {
        tasks[tasks.indexOf(task)].date = e.target.value;
        saveTasks();
      });

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "✔️";
      completeBtn.title = "Mark Complete";
      completeBtn.onclick = () => {
        tasks[tasks.indexOf(task)].completed = true;
        saveTasks();
        render();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Delete Task";
      deleteBtn.onclick = () => {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasks();
        render();
      };

      actions.appendChild(completeBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(textArea);
      li.appendChild(dateEl);
      li.appendChild(actions);

      taskListEl.appendChild(li);
    });

    completed.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-card";
      li.textContent = `${task.text} ${task.date ? `(Due: ${task.date})` : ""}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Delete Task";
      deleteBtn.style.marginLeft = "auto";
      deleteBtn.onclick = () => {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasks();
        render();
      };

      li.style.display = "flex";
      li.style.alignItems = "center";
      li.appendChild(deleteBtn);
      completedListEl.appendChild(li);
    });
  }

  window.addTask = function () {
    const text = textInput.value.trim();
    const date = dateInput.value;

    if (!text) {
      alert("Please enter a task.");
      return;
    }

    tasks.push({
      text,
      date,
      completed: false,
      category,
    });

    saveTasks();
    render();

    textInput.value = "";
    dateInput.value = "";
  };

  window.clearCompleted = function () {
    tasks = tasks.filter(t => !t.completed || t.category !== category);
    saveTasks();
    render();
  };

  window.pickRandom = function () {
    const pending = tasks.filter(t => t.category === category && !t.completed);
    if (pending.length === 0) {
      alert("No pending tasks!");
      return;
    }
    const randomTask = pending[Math.floor(Math.random() * pending.length)];
    alert("Random task: " + randomTask.text);
  };

  render();
});
