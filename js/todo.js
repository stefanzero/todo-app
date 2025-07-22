// Model
class Todo {
  constructor(id, text, completed) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// Controller
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.todoList = [];
    this.completedList = [];
    this.loadTodos();
    this.view.bindAddTodo(this.addTodo.bind(this));
    this.view.bindToggleCompleted(this.toggleCompleted.bind(this));
  }

  loadTodos() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      const todos = JSON.parse(storedTodos);
      this.todoList = todos.filter((todo) => !todo.completed);
      this.completedList = todos.filter((todo) => todo.completed);
      this.view.displayTodos(this.todoList);
      this.view.displayCompleted(this.completedList);
    }
  }

  addTodo(text) {
    const newTodo = new Todo(this.todoList.length + 1, text, false);
    this.todoList.push(newTodo);
    this.view.displayTodos(this.todoList);
    this.saveTodos();
  }

  toggleCompleted(id) {
    const todo = this.todoList.find((todo) => todo.id === id);
    if (todo) {
      this.todoList = this.todoList.filter((t) => t.id !== id);
      this.completedList.push(todo);
      this.completedList.forEach((t) => (t.completed = true));
      this.view.displayTodos(this.todoList);
      this.view.displayCompleted(this.completedList);
      this.saveTodos();
    } else {
      const completedTodo = this.completedList.find((todo) => todo.id === id);
      if (completedTodo) {
        this.completedList = this.completedList.filter((t) => t.id !== id);
        this.todoList.push(completedTodo);
        this.todoList.forEach((t) => (t.completed = false));
        this.view.displayTodos(this.todoList);
        this.view.displayCompleted(this.completedList);
        this.saveTodos();
      }
    }
  }

  saveTodos() {
    const todos = [...this.todoList, ...this.completedList];
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// View
class TodoView {
  constructor() {
    this.todoListElement = document.getElementById("todo-list");
    this.completedListElement = document.getElementById("completed-list");
    this.addTodoBtn = document.getElementById("add-todo-btn");
    this.todoInput = document.getElementById("todo-input");
  }

  bindAddTodo(handler) {
    this.addTodoBtn.addEventListener("click", () => {
      const text = this.todoInput.value.trim();
      if (text) {
        handler(text);
        this.todoInput.value = "";
      }
    });

    this.todoInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const text = this.todoInput.value.trim();
        if (text) {
          handler(text);
          this.todoInput.value = "";
        }
      }
    });
  }

  bindToggleCompleted(handler) {
    this.handler = handler;
  }

  displayTodos(todos) {
    this.todoListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = document.createElement("li");
      todoElement.classList.add("list-group-item", "todo-item");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = todo.id;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.handler(todo.id);
        }
      });
      const textElement = document.createElement("span");
      textElement.textContent = todo.text;
      todoElement.appendChild(checkbox);
      todoElement.appendChild(textElement);
      this.todoListElement.appendChild(todoElement);
    });
  }

  displayCompleted(todos) {
    this.completedListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = document.createElement("li");
      todoElement.classList.add("list-group-item", "todo-item");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = todo.id;
      checkbox.checked = true;
      checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
          this.handler(todo.id);
        }
      });
      const textElement = document.createElement("span");
      textElement.textContent = todo.text;
      textElement.classList.add("text-decoration-line-through");
      todoElement.appendChild(checkbox);
      todoElement.appendChild(textElement);
      this.completedListElement.appendChild(todoElement);
    });
  }
}

// Initialize the app
const model = new Todo();
const view = new TodoView();
const controller = new TodoController(model, view);
