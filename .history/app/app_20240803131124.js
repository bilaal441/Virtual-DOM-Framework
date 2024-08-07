import {createElement, generateUniqueID} from "../my-framework/src/dom.js";
import {createStore} from "../my-framework/src/state.js";
import router from "../my-framework/src/router.js";

// Function to get the initial hash from the URL
function getInitialHash() {
  return window.location.hash.replace("#", "");
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
    console.log(id, "id");

    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          status: !todo.status,
        };
      }
      return todo;
    });

    store.update({
      todos: newTodos,
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

    store.update({
      todos: newTodos,
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

  const deleteTodoHandler = (e) => {};

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
      {class: "main", style: "display: block;"},
      createElement(
        "div",
        {class: "toggle-all-container"},
        createElement("input", {
          class: "toggle-all",
          type: "checkbox",
        }),
        createElement(
          "label",
          {
            class: "toggle-all-label",
            for: "toggle-all",
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
              class: `${todo.status ? "completed" : ""}  ${
                todo.IsEditing ? "editing" : ""
              }`,
              ondblclick: ondblclickHandler,
              "data-id": todo.id,
            },
            createElement(
              "div",
              {class: "view"},
              createElement("input", {
                class: "toggle",
                type: "checkbox",
                checked: todo.status,
                onchange: onchangeHandler,
              }),
              createElement("label", {}, todo.text),
              createElement("button", {
                class: "destroy",
                onclick: deleteTodoHandler,
              })
            ),
            createElement("input", {
              class: "edit",
              value: todo.text,
              onblur: onblurHandler,
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
          },
          createElement(
            "span",
            {class: "todo-count"},
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
            {class: "filters"},
            createElement(
              "li",
              {},
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
              {},
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
              {},
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
