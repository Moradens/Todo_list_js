document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const toggleDoneBtn = document.getElementById('toggleDoneBtn');
    const tasksList = document.getElementById('tasks');
    const urlParams = new URLSearchParams(window.location.search);
    const showCompleted = urlParams.get('showCompleted') === 'true';

    loadTasks();

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        const taskPriority = parseInt(priorityInput.value);

        if (taskText !== '' && !isNaN(taskPriority) && taskPriority >= 1) {
            addTask(taskText, taskPriority, false);
            taskInput.value = '';
            priorityInput.value = '';
            saveTasks();
        }
    });

    toggleDoneBtn.addEventListener('click', function () {
        toggleDoneFilter();
    });

    function addTask(taskText, taskPriority, isDone) {
        const listItem = document.createElement('li');
        listItem.draggable = true;
        listItem.innerHTML = `
                    <div class="task ${isDone ? 'done' : ''}" draggable="true" ondragstart="drag(event)">
                        <span class="newitem">${taskText}</span>
                        <span class="priority">${taskPriority}</span>
                        <button class="deleteBtn">Delete</button>
                        <button class="doneBtn">${isDone ? 'Undo' : 'Done'}</button>
                    </div>`;
        tasksList.appendChild(listItem);

        const deleteBtn = listItem.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function () {
            deleteTask(listItem);
        });

        const doneBtn = listItem.querySelector('.doneBtn');
        doneBtn.addEventListener('click', function () {
            toggleTaskDone(listItem);
        });

        sortTasks();
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    function toggleTaskDone(taskItem) {
        const doneBtn = taskItem.querySelector('.doneBtn');
        const isDone = doneBtn.textContent === 'Done';
        const taskText = taskItem.querySelector('.newitem');

        if (isDone) {
            taskItem.classList.add('done');
            doneBtn.textContent = 'Undo';
        } else {
            taskItem.classList.remove('done');
            doneBtn.textContent = 'Done';
        }

        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('.task')).map(task => {
            const text = task.querySelector('.newitem').textContent;
            const priority = parseInt(task.querySelector('.priority').textContent);
            const isDone = task.classList.contains('done');
            return { text, priority, done: isDone };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        storedTasks.forEach(task => addTask(task.text, task.priority, task.done));
    }

    function sortTasks() {
        const items = Array.from(document.querySelectorAll('.task'));
        items.sort((a, b) => {
            const priorityA = parseInt(a.querySelector('.priority').textContent);
            const priorityB = parseInt(b.querySelector('.priority').textContent);
            return priorityA - priorityB;
        });
        items.forEach(item => tasksList.appendChild(item));
    }

    function toggleDoneFilter() {
        const queryParams = new URLSearchParams(window.location.search);

        if (!showCompleted) {
            queryParams.set('showCompleted', 'true');
        } else {
            queryParams.delete('showCompleted');
        }

        window.location.search = queryParams.toString();
    }
    if (!showCompleted) {
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            const isDone = task.classList.contains('done');
            if (isDone) {
                task.style.display = 'none';
            } else {
                task.style.display = 'flex';
            }
        });
    }
});
