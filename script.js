const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const LIMIT = 20;

let allTasks = [];
let currentFilter = 'all';
let currentSearch = '';

const taskList = document.querySelector('.task_list');
const addNewTaskForm = document.querySelector('.add_new_task');
const navList = document.querySelector('.nav_list');
const navListItems = document.querySelectorAll('.nav_item');
const searchbarInput = document.querySelector('.searchbar__input');


// функция создания новой задачи
function addTask(newTaskInfo) {

    // элемент списка <li>
    const newTask = document.createElement('li');
    newTask.setAttribute('class', 'task');
    newTask.dataset.id = newTaskInfo.id;

    // <div> в котором <span> с текстом задачи
    const newTaskTextDiv = document.createElement('div');
    newTaskTextDiv.setAttribute('class', 'task_info');
    const iconImportant = document.createElement('i');
    iconImportant.setAttribute('class', 'fa-regular fa-star');
    if (!newTaskInfo.important) {
        iconImportant.classList.add('hide');
    }
    const newTaskText = document.createElement('span');
    newTaskText.setAttribute('class', 'task_text');
    if (newTaskInfo.completed) {
        iconImportant.classList.add('completed');
        newTaskText.classList.add('completed');
    }
    newTaskText.textContent = newTaskInfo.title;
    newTaskTextDiv.appendChild(iconImportant);
    newTaskTextDiv.appendChild(newTaskText);

    // кнопка mark important
    const newTaskBtnMarkImportant = document.createElement('button');
    newTaskBtnMarkImportant.setAttribute('class', 'task_important__button');
    newTaskBtnMarkImportant.textContent = newTaskInfo.important ? 'Not Important' : 'Mark Important';
    if (newTaskInfo.important) {
        newTaskBtnMarkImportant.classList.add('not_important');
    }

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
            important: false,
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
    if (!response.ok) {
        throw new Error(`Ошибка удаления: ${response.status}`);
    }
}

// обновление задачи
async function updateTask(task) {
    const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            completed: task.completed,
        }),
    });
    if (!response.ok) {
        throw new Error(`Ошибка изменения данных: ${response.status}`);
    }
}

// отображение списка дел
function renderTasks() {
    taskList.replaceChildren();

    let tasks = [...allTasks];

    // фильтр
    switch (currentFilter) {
        case 'active':
            tasks = tasks.filter(task => !task.completed);
            break;
        case 'done':
            tasks = tasks.filter(task => task.completed);
            break;
    }

    // поиск
    if (currentSearch.trim()) {
        tasks = tasks.filter(task =>
            task.title.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    tasks.forEach(addTask);

    // подсветка выбранного фильтра
    navListItems.forEach(navListItem => {
        navListItem.classList.remove('active');
        if (navListItem.dataset.f === currentFilter) {
            navListItem.classList.add('active');
        }
    });
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
        newTask.id = crypto.randomUUID();
        allTasks.push(newTask);

        renderTasks();
    } catch (error) {
        alert(`Не удалось сохранить задачу. ${error.message}`);
    }
})

// загрузка задач из api при загрузке окна
document.addEventListener('DOMContentLoaded', async () => {
    allTasks = (await getTasks()).map(task => ({
        ...task,
        important: false
    }));

    renderTasks();
})

// действия с taskList
taskList.addEventListener('click', async (e) => {
    try {
        const clickedElement = e.target;
        // если была нажата кнопка удаления задачи
        if (clickedElement.closest('.task_delete__button')) {
            const task = clickedElement.closest('.task');
            const taskId = task.dataset.id;
            await deleteTask(taskId);
            allTasks = allTasks.filter(task => String(task.id) !== taskId);
            renderTasks();
        }
        // если нажат сам элемент списка задач
        if (clickedElement.classList.contains('task')) {
            const taskId = clickedElement.dataset.id;
            const taskText = clickedElement.querySelector('.task_text');
            const taskImportantIcon = clickedElement.querySelector('.fa-star');
            const task = allTasks.find((task) => String(task.id) === taskId);

            // try..catch для того, чтобы интерфейс менялся сразу, не ожидая ответа сервера
            const previousState = task.completed;
            task.completed = !previousState;
            taskText.classList.toggle('completed');
            taskImportantIcon.classList.toggle('completed');
            try {
                await updateTask(task);
            } catch {
                task.completed = previousState;
                taskText.classList.toggle('completed');
                taskImportantIcon.classList.toggle('completed');
            }
            renderTasks();
        }
        // кнопка mark important
        if (clickedElement.classList.contains('task_important__button')) {
            const taskId = clickedElement.parentElement.dataset.id;
            const task = allTasks.find((task) => String(task.id) === taskId)
            task.important = !task.important;
            renderTasks();
        }
    } catch (error) {
        console.log(error);
    }
})

// listener на nav
navList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return;
    currentFilter = e.target.dataset.f;
    renderTasks();
})

// listener на поле поиска
searchbarInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTasks();
})