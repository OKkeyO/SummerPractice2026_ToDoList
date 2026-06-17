// загрузка задач из api при загрузке окна
window.onload = async () => {
    let tasks = await getTasks(3);

    tasks.map((task) => {
        addTask(task)
    });
}

const taskList = document.querySelectorAll('.task_list');
const addNewTaskForm = document.querySelector('.add_new_task');

// listener к форме создания новой задачи
addNewTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let addNewTaskValue = document.getElementById('newTask').value;

    addTask(addNewTaskValue);
})

// функция создания новой задачи
function addTask(newTaskInfo) {

    // элемент списка <li>
    const newTask = document.createElement('li');
    newTask.setAttribute('class', 'task');

    // <div> в котором <span> с текстом задачи
    const newTaskTextDiv = document.createElement('div');
    newTaskTextDiv.setAttribute('class', 'task_info');
    const newTaskText = document.createElement('span');
    newTaskText.innerHTML = newTaskInfo;
    newTaskTextDiv.appendChild(newTaskText);

    // кнопка mark important
    const newTaskBtnMarkImportant = document.createElement('button');
    newTaskBtnMarkImportant.setAttribute('class', 'task_important__button');
    newTaskBtnMarkImportant.innerHTML = 'Mark Important';

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
    taskList[0].appendChild(newTask);
}

// функция получения задач из api
async function getTasks(amount) {

    let tasks = [];

    for (let i = 0; i < amount; i++) {

        let task;
        await fetch(`http://jsonplaceholder.typicode.com/todos/${i}`)
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
                    task = json.title;
                }
            });
        if (task !== undefined) {
            tasks.push(task);
        }
    }
    return tasks;
}
