// Constantes y variables

const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-tlf');
const formbtn = document.querySelector('#form-btn');
const closebtn = document.querySelector('#close-btn')
const form = document.querySelector('#form');
const inputs = document.querySelector('.inputs');
const NAME_REGEX = /^([A-ZÁ-Ú\u00d1])[a-zá-ú\u00f1]{2,15}$/
const NUMBER_REGEX = /^((0412)|(0212)|(0416)|(0424)|(0414))[0-9]{7}$/;
let numberValidation = true;
let nameValidation = true;

const user = JSON.parse(localStorage.getItem('user'));


if (!user) {
    window.location.href = '../index.html'; 
}


//Funcion que muestra errores y bloquea botones
function validar(inputItem,verification) {

    if (numberValidation && nameValidation) {
        formbtn.disabled = false;
        
    } else {
        formbtn.disabled = true;
    }

    const  message = inputItem.parentElement.children[1];

if (!inputItem.value) {
        inputItem.classList.remove('error');
        inputItem.classList.remove('success');
        message.classList.remove('show');
    } else if (verification) {
        inputItem.classList.add('success');
        inputItem.classList.remove('error');
        message.classList.remove('show');
    } else {
        inputItem.classList.remove('success');
        inputItem.classList.add('error');
        message.classList.add('show');
    }

}

// Aplicando funciones

inputNumber.addEventListener('input', e => {
    numberValidation = NUMBER_REGEX.test(inputNumber.value);
    validar(inputNumber,numberValidation)
});

inputName.addEventListener('input', e => {
    nameValidation = NAME_REGEX.test(inputName.value)
    validar(inputName,nameValidation);
});


// Agregando una lista

form.addEventListener('submit',async e => {
    e.preventDefault();
    const jsonResponse = await fetch("http://localhost:3000/contacts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contact: inputName.value, number: inputNumber.value, user: user.username}),
        });

        const response = await jsonResponse.json(); 

        const li = document.createElement('li');
    li.innerHTML = `
    <div class="inputs-editados" id="${response.id}">
    <input id="input-edit-name"  type="text" value=${response.contact} readonly>
    <input id="input-edit-number" type="text" value=${response.number} readonly>
    <div class="icons">
    <button class="edit-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>                  
    </button>
    <button class="delete-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>  
    </button>
    </div>
    </div>
    `;
    list.append(li);

    // Eliminando lo escrito en el input
    
    inputName.value = '';
    inputNumber.value = '';
    validar(inputName,0)
    validar(inputNumber,0)
    nameValidation = false;
    numberValidation = false;
    formbtn.disabled = true;
  
});



// Eventos con respecto a los contactos agregados
// Borrar Contactos
list.addEventListener('click', async e => {
    const dltbtn = e.target.closest('.delete-icon')
    if (dltbtn) {
        const id = dltbtn.parentElement.parentElement.id;
        
        await fetch(`http://localhost:3000/contacts/${id}`, {
            method: 'DELETE',
        });
            e.target.closest ('.delete-icon').parentElement.parentElement.remove();
            alert ("Contacto eliminado")
        }
        
        //Editar Contactosss    
        else if (e.target.closest('.edit-icon')) {
            
            const editbtn = e.target.closest('.edit-icon')
            const inputEditName = editbtn.parentElement.parentElement.children [0]
            const inputEditNumber = editbtn.parentElement.parentElement.children [1]
            const idid = editbtn.parentElement.parentElement.id
            
            await fetch(`http://localhost:3000/contacts/${idid}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({contact: inputEditName.value, number: inputEditNumber.value}),
            });
            
            if (editbtn.classList.contains('editando')) {
                editbtn.classList.remove('editando');
                inputEditNumber.setAttribute('value', inputEditNumber.value);
            inputEditName.setAttribute('value', inputEditName.value);
            inputEditNumber.setAttribute('readonly', 'true');
            inputEditName.setAttribute('readonly', 'true');
            alert ("Contacto editado")
            
            inputEditNumber.classList.remove('editing');
            inputEditName.classList.remove('editing');
        } else {
            
            //Para poder editar
                // Aplicando funciones en las ediciones 
                
                inputEditName.addEventListener('input', e => {
                    nameAddedValidation = NAME_REGEX.test(inputEditName.value);
                    validateAddedInput(e.target, nameAddedValidation);
                });
                
                inputEditNumber.addEventListener('input', e => {
                    phoneAddedValidation = NUMBER_REGEX.test(inputEditNumber.value);
                    validateAddedInput(e.target, phoneAddedValidation);
                });
            editbtn.classList.add('editando');
            inputEditNumber.removeAttribute('readonly');
            inputEditName.removeAttribute('readonly');
            inputEditNumber.classList.add('editing');
            inputEditName.classList.add('editing');
            const end = inputEditNumber.value.length;
            inputEditNumber.setSelectionRange(end, end);
            inputEditNumber.focus();
            
            // Funcion para validar las ediciones
            let nameAddedValidation = true;
            let phoneAddedValidation = true;
            
        const validateAddedInput = (input, regexValidation) => {
            if (nameAddedValidation && phoneAddedValidation) {
                editbtn.classList.remove('no-save');
            } else {
                editbtn.classList.add('no-save');
            }
            if (regexValidation) {
                input.classList.remove('error');
            } else {
                input.classList.add('error');
            }
        };
        
        
        
    }   
}
});
//Cerrar sesion
closebtn.addEventListener('click', e => {
    localStorage.removeItem('user')
    window.location.href = '../index.html';
})

const getContacts = async () => {
    const response = await fetch("http://localhost:3000/contacts", {method:'GET'});
    const jsonContacts = await response.json();
    const userContacts = jsonContacts.filter(conta => conta.user === user.username)
    userContacts.forEach(conta => {
        const li = document.createElement('li');
    li.innerHTML = `
    <div class="inputs-editados" id="${conta.id}">
    <input id="input-edit-name"  type="text" value=${conta.contact} readonly>
    <input id="input-edit-number" type="text" value=${conta.number} readonly>
    <div class="icons">
    <button class="edit-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>                  
    </button>
    <button class="delete-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="svg">
    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>  
    </button>
    </div>
    </div>
    `;
    list.append(li);
    });
}

getContacts();







