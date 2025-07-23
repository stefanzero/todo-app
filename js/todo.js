/**
 * Model-View-Controller (MVC) Pattern
 *
 * The application follows the Model-View-Controller (MVC) pattern, a widely used software
 * architecture that separates an application into three interconnected components:
 *
 * • Model: Represents the data and business logic of the application.
 * • View: Handles the user interface and display of the application.
 * • Controller: Acts as an intermediary between the model and view, receiving input from the
 *   user and updating the model and view accordingly.
 */

// Model
/**
 * Represents a single todo item, encapsulating its properties and behavior.
 *
 * @class Todo
 */
class Todo {
  /**
   * Initializes a new instance of the Todo class.
   *
   * @param {number} id - The unique identifier for the todo item.
   * @param {string} text - The description of the todo item.
   * @param {boolean} completed - The completion status of the todo item.
   * @param {number} priority - The priority level of the todo item.
   * @param {string} dueDate - The due date for the todo item.
   */

  constructor(id, text, completed, priority, dueDate) {
    this.id = id;
    this.text = text;
    this.completed = completed;
    this.priority = priority;
    this.dueDate = dueDate;
  }
}

// Controller
/**
 * TodoController Class
 * =====================
 *
 * The TodoController class is a central component that manages the interaction
 * between the Todo model and view. It encapsulates the business logic for adding,
 * toggling, and saving todo items.
 *
 * Class Methods:
 * --------------
 *
 * • constructor(model, view): Initializes the TodoController instance with
 *   a Todo model and view, and sets up event bindings for adding and toggling
 *   todo items.
 * • loadTodos(): Loads todo items from local storage and updates the view
 *   with the active and completed todo lists.
 * • addTodo(text, priority, dueDate): Adds a new todo item to the active
 *   list and updates the view.
 * • toggleCompleted(id): Toggles a todo item as completed or not, moving
 *   it between the active and completed lists, and updates the view.
 * • saveTodos(): Saves the current state of todos to local storage as a
 *   JSON string.
 *
 * UI Events Handled by the Controller:
 * --------------
 *
 * The controller handles the following UI events:
 *
 * • Add Todo: triggered when the user clicks the 'add todo' button or presses
 *   the enter key while typing in the new todo input field. The controller's
 *   addTodo method is called to add the new todo item to the list.
 *
 * • Toggle Completed: triggered when the user clicks a checkbox next to a todo
 *   item. The controller's toggleCompleted method is called to toggle the
 *   completion status of the todo item and move it between the active and
 *   completed lists accordingly.
 *
 * These events are bound to the controller's methods using the bindAddTodo and
 * bindToggleCompleted methods, which ensure that the correct context is passed
 * to the event handlers. In this case, "context" refers to the value of the
 * 'this' keyword, which is set to the controller object. This allows the event
 * handlers to access the controller's properties and methods, enabling them to
 * perform the necessary actions when the events are triggered.
 */
class TodoController {
  /**
   * Initializes a new instance of the TodoController class.
   *
   * @param {TodoModel} model - The model that encapsulates the todo data.
   * @param {TodoView} view - The view that renders the todo items.
   */
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.todoList = [];
    this.completedList = [];
    this.loadTodos();
    /**
     * Bind the addTodo method to the view's addTodo event handler:
     *
     * This line sets up an event listener on the view that calls the addTodo method
     * when the user triggers the 'add todo' action. The bind method is used to
     * ensure that the addTodo method is called with the correct context (i.e., 'this'
     * refers to the current object).
     *
     * In other words, this line connects the view's UI element (e.g., a button) to
     * the controller's logic for adding a new todo item.
     */
    this.view.bindAddTodo(this.addTodo.bind(this));
    /**
     * Bind the toggleCompleted method to the view's toggleCompleted event handler:
     *
     * This line sets up an event listener on the view that calls the toggleCompleted
     * method when the user triggers the 'toggle completed' action (e.g., clicks a
     * checkbox). The bind method is used to ensure that the toggleCompleted method
     * is called with the correct context (i.e., 'this' refers to the current object).
     *
     * In other words, this line connects the view's UI element (e.g., a checkbox) to
     * the controller's logic for toggling the completion status of a todo item.
     */
    this.view.bindToggleCompleted(this.toggleCompleted.bind(this));
  }

  /**
   * Loads the todo items from local storage and updates the view.
   */
  loadTodos() {
    /**
     * Retrieve stored todo items from local storage:
     *
     * Local storage is a browser feature that allows data to be stored locally on
     * the client-side, without the need for a server. It is a key-value store, where
     * data is stored as a string value associated with a unique key.
     *
     * In this line of code, the getItem method is used to retrieve the value
     * associated with the key "todos". If a value is found, it is returned as a
     * string. If no value is found, null is returned.
     *
     * The retrieved value is stored in the storedTodos variable, which is then
     * parsed as JSON to restore the original todo item data.
     */
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      /**
       * Convert stored todo items from string to object:
       *
       * When data is stored in local storage, it is stored as a string. However, in
       * this application, the todo items are objects with properties like text,
       * completed, etc. To use these objects in the application, they need to be
       * converted back from a string to an object.
       *
       * The JSON.parse method is used to convert the storedTodos string back into an
       * array of todo item objects. This method takes a JSON string as input and
       * returns a JavaScript object.
       *
       * The resulting todos array is now an array of objects, where each object
       * represents a todo item with its properties (text, completed, etc.).
       */
      const todos = JSON.parse(storedTodos);
      /**
       * Filter todo items into active and completed lists:
       *
       * The filter method is a JavaScript array method that creates a new array with
       * all elements that pass the test implemented by the provided function.
       *
       * In these lines of code, the filter method is used to separate the todo items
       * into two lists: active (todoList) and completed (completedList).
       *
       * The callback function (todo) => !todo.completed is used to filter the todo
       * items. It returns true for todo items that are not completed (i.e., their
       * completed property is false), and false otherwise. As a result, the todoList
       * array will contain only the todo items that are not completed.
       *
       * Similarly, the callback function (todo) => todo.completed is used to filter
       * the todo items that are completed. It returns true for todo items that are
       * completed (i.e., their completed property is true), and false otherwise. As a
       * result, the completedList array will contain only the todo items that are
       * completed.
       */
      this.todoList = todos.filter((todo) => !todo.completed);
      this.completedList = todos.filter((todo) => todo.completed);
      this.view.displayTodos(this.todoList);
      this.view.displayCompleted(this.completedList);
    }
  }

  /**
   * Adds a new todo item to the list and updates the view.
   *
   * @param {string} text - The text of the new todo item.
   * @param {string} priority - The priority of the new todo item.
   * @param {string} dueDate - The due date of the new todo item.
   */
  addTodo(text, priority, dueDate) {
    const nextId = this.todoList.length + this.completedList.length + 1;
    const newTodo = new Todo(nextId, text, false, priority, dueDate);
    this.todoList.push(newTodo);
    this.view.displayTodos(this.todoList);
    this.saveTodos();
  }

  /**
   * Toggles a todo item as completed or not.
   *
   * If the item is currently in the todo list, it will be moved to the completed list.
   * If the item is currently in the completed list, it will be moved to the todo list.
   *
   * @param {number} id - The id of the todo item to toggle.
   */
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

  /**
   * Saves the current state of todos to local storage.
   *
   * Combines both the active and completed todo lists into a single array
   * and stores it in the browser's local storage as a JSON string.
   */

  saveTodos() {
    const todos = [...this.todoList, ...this.completedList];
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// View
class TodoView {
  /**
   * Initializes the TodoView by selecting DOM elements for the todo list,
   * completed list, add button, todo input, priority select, and due date input.
   * Configures the due date input to utilize the HTML5 datepicker.
   */

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

  /**
   * Processes the input from the todo form, validates it, and calls the provided handler.
   *
   * @param {Function} handler - The function to execute with the todo item's text, priority, and due date.
   * Triggers an alert if required fields are missing, otherwise clears the input fields after calling the handler.
   */

  handleToDoInput(handler) {
    if (this.todoInput.value.trim() === "" || this.dueDateInput.value === "") {
      alert(
        "Please fill out both the description and due date before adding a todo item.",
      );
      return;
    }
    const text = this.todoInput.value.trim();
    const priority = this.prioritySelect.value;
    const dueDate = this.dueDateInput.value;
    if (text) {
      /**
       * Call the event handler function with the provided arguments:
       *
       * This line calls the event handler function (referenced by the variable
       * 'handler') and passes the following arguments:
       *
       * - text: the text of the new todo item
       * - priority: the priority of the new todo item
       * - dueDate: the due date of the new todo item
       *
       * The event handler function is expected to handle the creation of a new todo
       * item based on the provided arguments.
       */
      handler(text, priority, dueDate);
      this.todoInput.value = "";
      this.dueDateInput.value = "";
    }
  }
  /**
   * Binds the add todo functionality to the add button and enter key.
   *
   * Attaches event listeners to the add button and the todo input field.
   * When the add button is clicked or the enter key is pressed while focused on the input field,
   * it processes the input and calls the provided handler function.
   *
   * @param {Function} handler - The function to execute with the todo item's text, priority, and due date.
   */

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

  /**
   * Binds the toggle completed functionality to the provided handler.
   *
   * Attaches an event listener to the todo list items. When a todo item is clicked,
   * it calls the provided handler with the todo item's id.
   *
   * @param {Function} handler - The function to execute with the todo item's id.
   */
  bindToggleCompleted(handler) {
    this.handler = handler;
  }

  /**
   * Creates a todo item element from the provided todo item.
   *
   * Dynamically generates a todo item element with a checkbox, text, priority, and due date,
   * based on the provided todo object. The checkbox's state is determined by the optional
   * checked parameter. When the checkbox is changed, it triggers a callback function with
   * the todo item's ID.
   *
   * @param {Object} todo - The todo item to create an element for.
   * @param {boolean} [checked=false] - Whether or not the todo item is checked.
   * @returns {HTMLElement} The created todo item element.
   */
  createToDoElement(todo, checked = false) {
    const todoElement = document.createElement("li");
    todoElement.classList.add(
      "list-group-item",
      "todo-item",
      "row",
      "flex-nowrap",
      "align-items-start",
    );
    /*
    each todo item has a checkbox, text, priority, and due date
    */
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
    /*
    now add the elements to the todo element
    */
    todoElement.appendChild(checkbox);
    todoElement.appendChild(textElement);
    todoElement.appendChild(priorityElement);
    todoElement.appendChild(dueDateElement);
    return todoElement;
  }

  /**
   * Displays a list of todos in the todo list element.
   *
   * @param {Object[]} todos - The list of todos to display.
   */
  displayTodos(todos) {
    this.todoListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = this.createToDoElement(todo);
      this.todoListElement.appendChild(todoElement);
    });
  }

  /**
   * Displays a list of completed todos in the completed list element.
   *
   * @param {Object[]} todos - The list of completed todos to display.
   */
  displayCompleted(todos) {
    this.completedListElement.innerHTML = "";
    todos.forEach((todo) => {
      const todoElement = this.createToDoElement(todo, true);
      this.completedListElement.appendChild(todoElement);
    });
  }
}

// Initialize the app

/**
 * Application Initialization
 *
 * The application is initialized through a series of steps that set up the necessary components
 * and configure the app for use.
 */

/**
 * Initialization Steps
 *
 * 1. Model Initialization: The model is initialized by creating an instance of the TodoModel class.
 * 2. View Initialization: The view is initialized by creating an instance of the TodoView class.
 * 3. Controller Initialization: The controller is initialized by creating an instance of the TodoController class.
 * 4. Event Binding: The controller binds events to the view to handle user input and update the model and view accordingly.
 * 5. Initial Data Load: The controller loads the initial data from the model and updates the view to display the todo items.
 */
const model = new Todo();
const view = new TodoView();
const controller = new TodoController(model, view);
