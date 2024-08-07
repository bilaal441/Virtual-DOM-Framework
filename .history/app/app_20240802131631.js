import {createElement} from "../my-framework/src/dom.js";
import {createStore} from "../my-framework/src/state.js";
import router from "../my-framework/src/router.js";

function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomNum}`;
}

// Function to get the initial hash from the URL
function getInitialHash() {
  return window.location.hash;
}

// Initial state including the activehash from the URL
const initialState = {
  todos: [],
  newTodo: "",
  activehash: getInitialHash(), // Set initial hash
  filteredTodos: [], // Add filteredTodos to the initial state
};

let store;

function filterTodos(state) {
  return state.todos.filter((todo) => {
    if (state.activehash === "/active") {
      return !todo.status;
    }
    if (state.activehash === "/completed") {
      return todo.status;
    }
    return true; // For "/", show all todos
  });
}

router.handleRouteChange((activehash) => {
  console.log("Route changed to:", activehash);
  const filteredTodos = filterTodos({...store.state, activehash});
  console.log(filterTodos);
  store?.update({
    activehash,
    filteredTodos,
  });
});

function TodoApp(store) {
  const onchangeHandler = function (e) {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;

    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          status: !todo.status,
        };
      }
      return todo;
    });

    const filteredTodos = filterTodos({...store.state, todos: newTodos});
    console.log(filteredTodos);
    store.update({
      todos: newTodos,
      filteredTodos, // Update filteredTodos
    });
  };

  const ondblclickHandler = (e) => {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;
    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          IsEditing: true,
        };
      }

      return todo;
    });

    const filteredTodos = filterTodos({...store.state, todos: newTodos});
    store.update({
      todos: newTodos,
      filteredTodos,
    });
    const input = el.querySelector(".edit");
    if (input) {
      input.focus();
    }
  };

  const onblurHandler = (e) => {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;

    const newTodoText = e.target.value;
    if (!newTodoText) return;

    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text: e.target.value,
          IsEditing: false,
        };
      }
      return todo;
    });

    const filteredTodos = filterTodos({...store.state, todos: newTodos});
    store.update({
      todos: newTodos,
      filteredTodos, // Update filteredTodos
    });
  };

  return createElement(
    "section",
    {class: "todoapp"},
    createElement(
      "header",
      {class: "header"},
      createElement("h1", {}, "todos"),
      createElement("input", {
        class: "new-todo",
        placeholder: "What needs to be done?",
        autofocus: true,
        value: store.state.newTodo,
        "data-id": generateUniqueID(),
        oninput: (e) => {
          store.update({newTodo: e.target.value});
        },

        onkeypress: (e) => {
          if (e.key === "Enter" && store.state.newTodo.trim() !== "") {
            const newTodos = [
              {
                text: store.state.newTodo.trim(),
                status: false,
                id: generateUniqueID(),
                IsEditing: false,
              },
              ...store.state.todos,
            ];

            const filteredTodos = filterTodos({
              ...store.state,
              todos: newTodos,
            });

            store.update({
              todos: newTodos,
              newTodo: "",
              filteredTodos,
            });
            console.log("Todos after addition:", store.state.todos);
          }
        },
      })
    ),
    createElement(
      "main",
      {class: "main", style: "display: block;", "data-id": generateUniqueID()},
      createElement(
        "div",
        {class: "toggle-all-container"},
        createElement("input", {
          class: "toggle-all",
          type: "checkbox",
          "data-id": generateUniqueID(),
        }),
        createElement(
          "label",
          {
            class: "toggle-all-label",
            for: "toggle-all",
            "data-id": generateUniqueID(),
          },
          "Mark all as complete"
        )
      ),
      createElement(
        "ul",
        {class: "todo-list"},
        ...store.state.filteredTodos.map((todo) =>
          createElement(
            "li",
            {
              "data-id": todo.id,
              class: `${todo.status ? "completed" : ""}  ${
                todo.IsEditing ? "editing" : ""
              }`,
              ondblclick: ondblclickHandler,
            },
            createElement(
              "div",
              {class: "view"},
              createElement("input", {
                class: "toggle",
                type: "checkbox",
                checked: todo.status,
                onchange: onchangeHandler,
                "data-id": generateUniqueID(),
              }),
              createElement(
                "label",
                {"data-id": generateUniqueID()},
                todo.text
              ),
              createElement("button", {
                class: "destroy",
                "data-id": generateUniqueID(),
              })
            ),
            createElement("input", {
              class: "edit",
              value: todo.text,
              onblur: onblurHandler,
              "data-id": generateUniqueID(),
            })
          )
        )
      )
    ),
    store.state.todos.length
      ? createElement(
          "footer",
          {
            class: "footer",
            style: "display: block;",
            "data-id": generateUniqueID(),
          },
          createElement(
            "span",
            {class: "todo-count", "data-id": generateUniqueID()},
            createElement(
              "strong",
              {},
              store.state.todos.filter((todo) => !todo.status).length || "0"
            ),
            ` item${
              store.state.todos.filter((todo) => !todo.status).length !== 1
                ? "s"
                : ""
            } left`
          ),
          createElement(
            "ul",
            {class: "filters", "data-id": generateUniqueID()},
            createElement(
              "li",
              {"data-id": generateUniqueID()},
              createElement(
                "a",
                {
                  href: "#/",
                  class: `${store.state.activehash === "/" ? "selected" : ""}`,
                },
                "All"
              )
            ),
            createElement(
              "li",
              {"data-id": generateUniqueID()},
              createElement(
                "a",
                {
                  href: "#/active",
                  class: `${
                    store.state.activehash === "/active" ? "selected" : ""
                  }`,
                },
                "Active"
              )
            ),
            createElement(
              "li",
              {"data-id": generateUniqueID()},
              createElement(
                "a",
                {
                  href: "#/completed",
                  class: `${
                    store.state.activehash === "/completed" ? "selected" : ""
                  }`,
                },
                "Completed"
              )
            )
          ),
          createElement("button", {
            class: "clear-completed",
            style: "display: none;",
            "data-id": generateUniqueID(),
          })
        )
      : []
  );
}

// Initialize the store and render the app
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("app");
  store = createStore(
    {...initialState, filteredTodos: filterTodos(initialState)}, // Initialize with filteredTodos
    TodoApp,
    rootElement
  );
  console.log("Initial state:", store.state); // Log initial state
});
