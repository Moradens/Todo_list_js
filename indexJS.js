document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksList = document.getElementById('tasks');
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => addTask(task));
    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    });

    function addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.draggable = true;
        listItem.innerHTML = `
            <div class="task" draggable="true" ondragstart="drag(event)">
                <span class="newitem">${taskText}</span>
                <button class="deleteBtn">Delete</button>
            </div>`;
        tasksList.insertBefore(listItem, tasksList.firstChild);

        const deleteBtn = listItem.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function () {
            listItem.remove();
            saveTasks();
        });
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('.newitem')).map(item => item.textContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    window.drag = function (event) {
        event.dataTransfer.setData('text', event.target.outerHTML);
        event.target.style.opacity = '0.4';
    };

    window.allowDrop = function (event) {
        event.preventDefault();
    };

    window.drop = function (event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const draggedItem = document.createElement('div');
        draggedItem.innerHTML = data;
        const dropTarget = event.target.closest('.task');
        if (dropTarget) {
            const tasks = Array.from(tasksList.querySelectorAll('.task'));
            const dropIndex = tasks.indexOf(dropTarget);
            if (dropIndex !== -1) {
                const draggedIndex = tasks.indexOf(draggedItem.firstChild);
                const diff = Math.abs(dropIndex - draggedIndex);

                if (diff === 1 || diff === 0) {
                    event.target.appendChild(draggedItem.firstChild);
                }
            }
        }
        draggedItem.firstChild.style.opacity = '1';
    };
});