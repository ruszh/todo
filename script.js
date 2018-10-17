const todoList = document.querySelector('#todoList');
const filterForm = document.querySelector('form[name="filterForm"]');
const input = document.querySelector('#todoInput');
const submitBtn = document.querySelector('#submit-button');
const toggleBtn = document.querySelector('#toggle');
//Views

//==================

class InputView {
    constructor() {
        this.inputElement = document.querySelector('#todoInput');
    }
    addTodo() {
        const todoText = this.inputElement.value;
        
        this.inputElement.value = '';        
        return todoText;        
    }
    
}

class TodoListView {
    constructor() {
        this.listElement = document.querySelector('#todoList');
        this.spinner = document.querySelector('#spinner')
    }

    showSpinner() {
        this.spinner.style.display = 'block';
    }

    hideSpinner() {
        this.spinner.style.display = 'none';
    }

    render(itemsArr) {
        const items = itemsArr.reduce((els, el) => (els + `
            <li class="list-group-item ${(el.completed === true) ? 'completed' : ''}" data-id="${el.id}">
                <input type="checkbox" class="float-left custom-checkbox" />
                <span class="todo-text">${el.todoText}</span>
                <button class="btn float-right">Delete</button>
            </li>            
        `), '')
        this.listElement.innerHTML = '';
        this.listElement.innerHTML = items;
    }
}

class FilterView {
    constructor() {
        this.itemsLeftElement = document.querySelector('#itemLeft');
    }

    updateItemsLeft(q) {
        this.itemsLeftElement.innerHTML = q;
    }
}

//====================


class Controller {
    constructor(inputView, todoListView, filterView, todoStore) {
        this.inputView = inputView;
        this.todoListView = todoListView;
        this.todoStore = todoStore;
        this.filterView = filterView;
    }

    showSpinner() {
        this.todoListView.showSpinner();
    }

    hideSpinner() {
        this.todoListView.hideSpinner();
    }

    addTodo() {      
        const todoText = this.inputView.addTodo();
        if(!todoText) return;
        this.showSpinner()

        this.todoStore.addTodoToModel(todoText)
                .then(res => {
                    this.hideSpinner();
                    this.renderList(res);
                });
    }

    renderList(updatedList) {
        if(!updatedList) this.todoListView.render(this.todoStore.getTodosFromModel());
        else this.todoListView.render(updatedList);

        this.updateItemsLeft();
    }
    
    selectTodo(id) {
        this.todoStore.selectTodo(id);
    }
    switchFilter(filter) {
        this.todoStore.switchFilter(filter);
        this.renderList();
    }
    deleteTodo(id) {
        this.showSpinner();

        this.todoStore.removeTodo(id)
                .then(res => {                    
                    this.hideSpinner();
                    this.renderList(res);
                });        
    }

    toggleTodos() {
        this.todoStore.toggleTodos();
        this.renderList()
    }

    updateItemsLeft() {  
        const itemsLeft = this.todoStore.itemsLeft();  
        this.filterView.updateItemsLeft(itemsLeft);
    }
}


//Model

class TodoStore {
    constructor() {
        this.todos = [];
        this.filter = 'all';
    }

    addTodoToModel(text) {
        const todo = {
            todoText: text,
            id: new Date().getTime(),
            completed: false
        };
        this.todos.push(todo)
        return new Promise((res, rej) => {
            setTimeout(() => {
                const updatedTodos = this.todos;
                res(updatedTodos);
            }, 1000);            
        })
    }

    selectTodo(searchId) {        
        const todos = this.todos;
        
        this.todos = todos.map(el => {
            if(el.id === +searchId) {
                el.completed = !el.completed;
                return el;
            }
            return el;
        });
    };

    removeTodo(searchId) {
        const todos = this.todos;
        for(let i = 0; i < todos.length; i++) {
            if(todos[i].id === +searchId) {
                todos.splice(i, 1);                               
            }            
        }

        return new Promise((res, rej) => {
            setTimeout(() => {
                const updatedTodos = this.todos;
                res(updatedTodos);
            }, 1000);
        })
    }

    switchFilter(filter) {
        this.filter = filter;

    }
    itemsLeft() {
        return this.todos.filter(el => !el.completed).length;
    }

    toggleTodos() {        
        if(this.itemsLeft() !== 0) {
            this.todos = this.todos.map(el => {
                el.completed = true;
                return el;
            })
        } else {
            this.todos = this.todos.map(el => {
                el.completed = false;
                return el;
            })
        }        
    }

    getTodosFromModel() {
        const filter = this.filter;

        switch(filter) {
            case 'all':
                return this.todos;
            case 'active':
                return this.todos.filter(el => !el.completed);
            case 'completed':
                return this.todos.filter(el => el.completed);
        }
                
    }
} 



const inputView = new InputView();
const listView = new TodoListView();
const filterView = new FilterView();

const store = new TodoStore();

const controller = new Controller(inputView, listView, filterView, store)


input.addEventListener('keypress', (e) => {
    if(e.keyCode === 13) {
        controller.addTodo();
        $('#exampleModal').modal('hide');
    }
});

toggleBtn.addEventListener('click', (e) => {
    controller.toggleTodos();
});

submitBtn.addEventListener('click', () => {
    controller.addTodo();
    $('#exampleModal').modal('hide');
})

todoList.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.parentNode.dataset.id;

    if(target.tagName == 'BUTTON') {
        controller.deleteTodo(id);
    }

    if(target.tagName === 'INPUT') {
        controller.selectTodo(id);
        controller.renderList();
    }
});

filterForm.addEventListener('change', (e) => {
    controller.switchFilter(e.target.value)
});


