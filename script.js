
// fetch('http://jsonplaceholder.typicode.com/todos/1')
// .then(response => response.text())
// .then(json => console.log(json));

// async function getUsers(names) {
//
//     let users = [];
//
//     for (const name of names) {
//         let response = await fetch(`https://api.github.com/users/${name}`).then(
//             sucResponce => {
//                 if (sucResponce.status != 200) {
//                     return null;
//                 } else {
//                     return sucResponce.json();
//                 }
//             },
//             failResponce => {
//                 return null;
//             }
//         );
//
//         // let user = await response.json();
//         users.push(response);
//     }
//
//     return await Promise.all(users);
// }
//
//
//
// let users = getUsers(['OKkeyO', 'S4V4NN4', 'ADasfqwfasd']);
//
// console.log(users);

window.onload = () => {
    addTask("Hello World");
}

const taskList = document.querySelectorAll('.task_list');

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

