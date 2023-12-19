document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const tasksList = document.getElementById('tasks');

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
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
        });
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

        // Check if the drop target is a valid next position
        const dropTarget = event.target.closest('.task');
        if (dropTarget) {
            const tasks = Array.from(tasksList.querySelectorAll('.task'));
            const dropIndex = tasks.indexOf(dropTarget);

            // Check if the dragged item is being dropped next to another item
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
