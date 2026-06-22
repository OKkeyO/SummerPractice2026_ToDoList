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

    // <div> в котором <span> с текстом задачи
    const newTaskTextDiv = document.createElement('div');
    newTaskTextDiv.setAttribute('class', 'task_info');
    const newTaskText = document.createElement('span');
    newTaskText.textContent = newTaskInfo;
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
    try {
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
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// функция получения задач из api
async function getTasks() {
    try {
        const response = await fetch(`${API_URL}?_limit=${LIMIT}`);

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.log("Не удалось загрузить задачи", error);
        return [];
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
        if (!newTask) {
            throw new Error("Сервер не вернул данные новой задачи.")
        }
        // меняем id у задачи, потому что api всегда возвращает фиксированное значение
        newTask.id = allTasks.length + 1;
        allTasks.push(newTask);

        addTask(newTask.title);
    } catch (error) {
        alert(`Не удалось сохранить задачу. ${error.message}`);
    }
})

// загрузка задач из api при загрузке окна
document.addEventListener('DOMContentLoaded', async () => {
    allTasks = await getTasks();

    allTasks.forEach((task) => {
        if (task.title) {
            addTask(task.title)
        }
    });
})