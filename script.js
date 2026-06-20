const API_URL = 'http://jsonplaceholder.typicode.com/todos';
const LIMIT = 2;

let TASKS_FROM_API = [];

const TASK_LIST = document.querySelector('.task_list');
const ADD_NEW_TASK_FORM = document.querySelector('.add_new_task');


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
    TASK_LIST.appendChild(newTask);
}

// функция получения задач из api
async function getTasks() {

    let tasks = [];

    await fetch(`${API_URL}?_limit=${LIMIT}`)
        .then(res => {
            if (res.status !== 200) {
                return null;
            } else {
                return res.json();
            }
        })
        .then(json => {
            if (json == null) {
                return null;
            } else {
                tasks = json;
            }
        });

    return tasks;
}


// listener к форме создания новой задачи
ADD_NEW_TASK_FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    let addNewTaskTextArea = document.getElementById('newTask');
    let addNewTaskValue = addNewTaskTextArea.value;
    addNewTaskTextArea.value = "";

    addTask(addNewTaskValue);
})

// загрузка задач из api при загрузке окна
document.addEventListener('DOMContentLoaded', async () => {
    TASKS_FROM_API = await getTasks();

    TASKS_FROM_API.forEach((task) => {
        addTask(task.title)
    });
})