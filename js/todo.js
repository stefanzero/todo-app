// Model
class Todo {
  constructor(id, text, completed, priority, dueDate) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.priority = priority;
    this.dueDate = dueDate;
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
    // this.initDatePicker();
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

  addTodo(text, priority, dueDate) {
    const newTodo = new Todo(
      this.todoList.length + 1,
      text,
      false,
      priority,
      dueDate,
    );
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
    this.prioritySelect = document.getElementById("priority-select");
    this.dueDateInput = document.getElementById("due-date-input");

    // Update the dueDateInput to use the HTML5 datepicker
    this.dueDateInput.type = "date";
  }

  handleToDoInput(handler) {
    if (this.todoInput.value.trim() === "" || this.dueDateInput.value === "") {
      alert("Please fill out all required fields before adding a todo item.");
      return;
    }
    const text = this.todoInput.value.trim();
    const priority = this.prioritySelect.value;
    const dueDate = this.dueDateInput.value;
    if (text) {
      handler(text, priority, dueDate);
      this.todoInput.value = "";
      this.dueDateInput.value = "";
    }
  }
  bindAddTodo(handler) {
    this.addTodoBtn.addEventListener("click", () => {
      this.handleToDoInput(handler);
    });

    this.todoInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.handleToDoInput(handler);
      }
    });
  }

  bindToggleCompleted(handler) {
    this.handler = handler;
  }

  createToDoElement(todo, checked = false) {
    const todoElement = document.createElement("li");
    todoElement.classList.add(
      "list-group-item",
      "todo-item",
      "row",
      "flex-nowrap",
      "align-items-start",
    );
    const checkbox = document.createElement("input");
    checkbox.classList.add("col-1", "align-self-center");
    checkbox.type = "checkbox";
    checkbox.name = "todo";
    checkbox.checked = checked;
    checkbox.dataset.id = todo.id;
    checkbox.addEventListener("change", () => {
      this.handler(todo.id);
    });
    const textElement = document.createElement("span");
    textElement.classList.add("col-7", "todo-text");
    textElement.textContent = todo.text;
    const priorityElement = document.createElement("span");
    priorityElement.classList.add("priority", "col-2");
    priorityElement.textContent = `Priority: ${todo.priority}`;
    const dueDateElement = document.createElement("span");
    dueDateElement.classList.add("due-date", "col-2");
    dueDateElement.textContent = `Due Date: ${todo.dueDate}`;
    todoElement.appendChild(checkbox);
    todoElement.appendChild(textElement);
    todoElement.appendChild(priorityElement);
    todoElement.appendChild(dueDateElement);
    return todoElement;
  }

  displayTodos(todos) {
    this.todoListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = this.createToDoElement(todo);
      this.todoListElement.appendChild(todoElement);
    });
  }

  displayCompleted(todos) {
    this.completedListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = this.createToDoElement(todo, true);
      this.completedListElement.appendChild(todoElement);
    });
  }
}

// Initialize the app
const model = new Todo();
const view = new TodoView();
const controller = new TodoController(model, view);
