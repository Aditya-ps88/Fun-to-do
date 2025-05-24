let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const importantList = document.getElementById('important-tasks-list');
  const completedList = document.getElementById('completed-tasks-list');
  importantList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-card';

    const textArea = document.createElement('textarea');
    textArea.value = task.text;
    textArea.className = 'task-edit';
    textArea.readOnly = true;

    const footer = document.createElement('div');
    footer.className = 'task-footer';

    const dateSpan = document.createElement('em');
    dateSpan.className = 'task-date';
    dateSpan.textContent = task.date || '';

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
      if (textArea.readOnly) {
        textArea.readOnly = false;
        textArea.focus();
        editBtn.textContent = '💾';
      } else {
        textArea.readOnly = true;
        editBtn.textContent = '✏️';
        task.text = textArea.value;
        saveTasks();
        updateCategoryCounts();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      updateCategoryCounts();
    };

    const toggleCompleteBtn = document.createElement('button');
    toggleCompleteBtn.textContent = task.completed ? '⬜' : '✅';
    toggleCompleteBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateCategoryCounts();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(toggleCompleteBtn);

    footer.appendChild(dateSpan);
    footer.appendChild(actions);

    li.appendChild(textArea);
    li.appendChild(footer);

    if (task.completed) {
      completedList.appendChild(li);
    } else {
      importantList.appendChild(li);
    }
  });
}

function addImportantTask() {
  const taskTextElem = document.getElementById('important-task-text');
  const taskDateElem = document.getElementById('important-task-date');
  const taskText = taskTextElem.value.trim();
  const taskDate = taskDateElem.value;

  if (!taskText) {
    alert('Please enter a task.');
    return;
  }

  
  const category = 'Work';

  const newTask = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    category: category,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateCategoryCounts();

  taskTextElem.value = '';
  taskDateElem.value = '';
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  updateCategoryCounts();
}

function updateCategoryCounts() {
  const categories = ['Study', 'Shopping', 'Travel', 'Chores', 'Work'];
  categories.forEach(category => {
    const countElem = document.getElementById(`count-${category}`);
    if (countElem) {
      const count = tasks.filter(task => task.category === category && !task.completed).length;
      countElem.textContent = `${count} remaining`;
    }
  });
}

document.querySelectorAll('.randomizer').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    const categoryTasks = tasks.filter(task => task.category === category && !task.completed);
    if (categoryTasks.length === 0) {
      alert(`No tasks available in category ${category}`);
      return;
    }
    const randomTask = categoryTasks[Math.floor(Math.random() * categoryTasks.length)];
    alert(`Random ${category} task:\n\n${randomTask.text}`);
  });
});

document.getElementById('category-Study').addEventListener('click', function() {
  window.location.href = 'category/Study/category-study.html';
});

document.getElementById('category-Shopping').addEventListener('click', function() {
  window.location.href = 'category/Shopping/category-shopping.html';
});
document.getElementById('category-Travel').addEventListener('click', function() {
  window.location.href = 'category/Travel/category-travel.html';
});
document.getElementById('category-Chores').addEventListener('click', function() {
  window.location.href = 'category/Chores/category-chores.html';
});
document.getElementById('category-Work').addEventListener('click', function() {
  window.location.href = 'category/Work/category-work.html';
});

renderTasks();
updateCategoryCounts();
