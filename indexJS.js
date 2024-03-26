document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksList = document.getElementById('tasks');
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    storedTasks.forEach(task => addTask(task.text, task.priority));

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        const taskPriority = parseInt(priorityInput.value);

        if (taskText !== '' && !isNaN(taskPriority) && taskPriority >= 1) {
            addTask(taskText, taskPriority);
            taskInput.value = '';
            priorityInput.value = '';
            saveTasks();
        }
    });

    function addTask(taskText, taskPriority) {
        const listItem = document.createElement('li');
        listItem.draggable = true;
        listItem.innerHTML = `
            <div class="task" draggable="true" ondragstart="drag(event)">
                <span class="newitem">${taskText}</span>
                <span class="priority">${taskPriority}</span>
                <button class="deleteBtn">Delete</button>
            </div>`;
        tasksList.appendChild(listItem);

        const deleteBtn = listItem.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function () {
            deleteTask(listItem);
        });

        sortTasks();
    }

    function deleteTask(taskItem) {
        taskItem.remove();
        saveTasks();
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('.newitem')).map((item, index) => {
            return {
                text: item.textContent,
                priority: parseInt(document.querySelectorAll('.priority')[index].textContent)
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
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
});
