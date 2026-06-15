
// fetch('http://jsonplaceholder.typicode.com/todos/1')
// .then(response => response.text())
// .then(json => console.log(json));

async function getUsers(names) {

    let users = [];

    for (const name of names) {
        let response = await fetch(`https://api.github.com/users/${name}`).then(
            sucResponce => {
                if (sucResponce.status != 200) {
                    return null;
                } else {
                    return sucResponce.json();
                }
            },
            failResponce => {
                return null;
            }
        );

        // let user = await response.json();
        users.push(response);
    }

    return await Promise.all(users);
}



let users = getUsers(['OKkeyO', 'S4V4NN4', 'ADasfqwfasd']);

console.log(users);
