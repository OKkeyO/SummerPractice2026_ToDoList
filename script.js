const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const LIMIT = 20;

let allTasks = [];

const taskList = document.querySelector('.task_list');
const addNewTaskForm = document.querySelector('.add_new_task');


// функция создания новой задачи
function addTask(newTaskInfo) {

    // элемент списка <li>
    const newTask = document.createElement('li');
    newTask.setAttribute('class', 'task');
    newTask.dataset.id = newTaskInfo.id;

    // <div> в котором <span> с текстом задачи
    const newTaskTextDiv = document.createElement('div');
    newTaskTextDiv.setAttribute('class', 'task_info');
    const newTaskText = document.createElement('span');
    newTaskText.textContent = newTaskInfo.title;
    newTaskTextDiv.appendChild(newTaskText);

    // кнопка mark important
    const newTaskBtnMarkImportant = document.createElement('button');
    newTaskBtnMarkImportant.setAttribute('class', 'task_important__button');
    newTaskBtnMarkImportant.textContent = 'Mark Important';

    // кнопка удаления задачи
    const newTaskBtnDelete = document.createElement('button');
    newTaskBtnDelete.setAttribute('class', 'task_delete__button');
    const deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'fa-solid fa-trash-can');
    newTaskBtnDelete.appendChild(deleteIcon);

    // добавление элементов в список
    newTask.appendChild(newTaskTextDiv);
    newTask.appendChild(newTaskBtnMarkImportant);
    newTask.appendChild(newTaskBtnDelete);
    taskList.appendChild(newTask);
}

// POST запрос на api
async function saveTask(taskInfo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            userId: 1,
            title: taskInfo,
            completed: false,
        }),
    });
    if (!response.ok) {
        throw new Error(`Ошибка сохранения на сервере: ${response.status}`);
    }
    return await response.json();
}

// функция получения задач из api
async function getTasks() {
    try {
        const response = await fetch(`${API_URL}?_limit=${LIMIT}`);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log("Не удалось загрузить задачи", error);
        return [];
    }
}

// функция удаления задачи
async function deleteTask(taskId) {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
    });
    console.log(response);
    if (!response.ok) {
        throw new Error(`Ошибка удаления: ${response.status}`);
    }
}


// listener к форме создания новой задачи
addNewTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const addNewTaskTextArea = document.getElementById('newTask');
        const addNewTaskValue = addNewTaskTextArea.value;
        addNewTaskTextArea.value = "";

        const newTask = await saveTask(addNewTaskValue);
        // меняем id у задачи, потому что api всегда возвращает фиксированное значение
        newTask.id = allTasks.length + 1;
        allTasks.push(newTask);

        addTask(newTask);
    } catch (error) {
        alert(`Не удалось сохранить задачу. ${error.message}`);
    }
})

// загрузка задач из api при загрузке окна
document.addEventListener('DOMContentLoaded', async () => {
    allTasks = await getTasks();

    allTasks.forEach((task) => {
        if (task.title) {
            addTask(task)
        }
    });
})

// действия с taskList
taskList.addEventListener('click', async (e) => {
    try {
        const clickedElement = e.target;

        // если была нажата кнопка удаления задачи
        if (clickedElement.classList.contains('fa-trash-can')) {
            const task = clickedElement.parentElement.parentElement;
            const taskId = Number(task.dataset.id);
            await deleteTask(taskId);
            task.remove();
            allTasks = allTasks.filter(t => t.id !== taskId);
        }

    } catch (error) {
        console.log(error);
    }
})