//// FUNCIONES //////
//Funcion mostrar mensajes
const show = (message) => {
    notification.innerHTML = message
    notification.classList.add('show-notification');
    notification.classList.remove('no-show');
    setTimeout(() => {
        notification.classList.remove('show-notification');
        notification.classList.add('no-show');
    }, 1000);  
}

/// Notificaciones: Constantes
const notification= document.querySelector(".notification")

/// Ingresar usuario: Constantes
const formLogin = document.querySelector("#form-create")
const userLogin = document.querySelector("#contact-user")

if (document.URL.includes("index.html") )  {
formLogin.addEventListener('submit', async e => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users", {method:'GET'});
    const users = await response.json();
    const user = users.find(user => user.username === userLogin.value)
    if (!user) {
        show("El usuario no existe")
    } else {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href  = '../contactos/contacts.html';
    }
    })
}

/// Registrar usuario: Constantes 
 const formCreate = document.querySelector("#form-create-second")
 const userCreate = document.querySelector("#new-user")


// Ingresar usuarios o notificar errores
if (document.URL.includes("register.html") )  {
formCreate.addEventListener('submit', async e => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users", {method:'GET'});
    const users = await response.json();
    const user = users.find(user => user.username === userCreate.value)
    if (!userCreate.value) {
        show("Input vacio")
    } else if (user) {
        show("Usuario ya existente")
    } else {
        await fetch("http://localhost:3000/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: userCreate.value}),
        });
        show(`Usuario ${userCreate.value} creado`)
        userCreate.value = ""
    }
})
}
