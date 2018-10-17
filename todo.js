let todos = [];
let filter = 'all';

const todoList = document.querySelector('#todoList');

const filterForm = document.querySelector('form[name="filterForm"]');
const input = document.querySelector('#todoInput');


function renderList() {
    todoList.innerHTML = '';

    switch (filter) {
        case 'all':
            todos
                .forEach((el, index) => {        
                    todoList.appendChild(createItem(el.todoText, index, el.completed));
            });
            break;
        case 'active':
            todos                
                .forEach((el, index) => {   
                    if(!el.completed) {
                        todoList.appendChild(createItem(el.todoText, index, el.completed));
                    }  
                    return;
                });            
            break;
        case 'completed':
            todos
                .forEach((el, index) => {        
                    if(el.completed) {
                        todoList.appendChild(createItem(el.todoText, index, el.completed));
                    }                    
                });
            break;    
    }
    showItemLeft();
    
}


function addTodo(text) {
    const todo = {
        todoText: text,
        completed: false
    }
    todos.push(todo)
}

function removeTodo(todoIndex) {
    todos.splice(todoIndex, 1);
    renderList();
}


function addDeleteBtn(index) {
    const button = document.createElement('button');

    button.classList.add('btn');
    button.classList.add('float-right');
    button.innerText = 'Delete';
    button.dataset.index = index;

    return button;
}

function addCheckbox(index) {
    const checkboxEl = document.createElement('input');

    checkboxEl.type = 'checkbox';
    checkboxEl.classList.add('float-left');    
    checkboxEl.dataset.index = index;

    return checkboxEl;
}

function createItem(text, index, completed) {
    const itemEl = document.createElement('li');
    
    itemEl.classList.add('list-group-item');

    if(completed) {
        itemEl.classList.add('completed')
    }
    
    itemEl.innerText = text;
    itemEl.appendChild(addCheckbox(index));     
    itemEl.appendChild(addDeleteBtn(index));

    return itemEl;
}

function selectTodo(index) {
    const todo = todos[index];
    todo.completed = !todo.completed;
}

function toggleAll() {
    if(todos.filter(el => !el.completed).length == 0) {
        todos.forEach(el => el.completed = false); 
        renderList();        
    } else {
        todos.forEach(el => el.completed = true);
        renderList();
    }
}

function showItemLeft() {
    const itemLeftEl = document.querySelector('#itemLeft');
    itemLeftEl.innerText = todos.filter(el => !el.completed).length;    
}


input.addEventListener('keypress', function(e) {
    if(e.keyCode === 13) {
        if(input.value === '') return;
        addTodo(input.value);
        input.value = ''; 
        renderList();
    }
});

todoList.addEventListener('click', function(e) {
    const target = e.target;
    if(target.tagName == 'BUTTON') {
        removeTodo(target.dataset.index);
        renderList();
    }
    if(target.tagName === 'INPUT') {
        selectTodo(target.dataset.index);
        renderList();
    }
});

filterForm.addEventListener('change', function(e) {
    filter = e.target.value;
    renderList();
});


renderList();


