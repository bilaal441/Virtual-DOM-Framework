import {createElement} from "../my-framework/src/dom.js";
import {createStore} from "../my-framework/src/state.js";
import router from "../my-framework/src/router.js";

export function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomNum}`;
}

const initialState = {
  todos: [],
  newTodo: "",
  activehash: "/",
};
let store;

router.handleRouteChange((activehash) => {
  console.log("Route changed to:", activehash);
  store?.update({
    activehash,
  });
});

function TodoApp(store) {
  const onchangeHandler = function (e) {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;

    store.update({
      todos: store.state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            status: !todo.status,
          };
        }
        return todo;
      }),
    });
  };

  const filteredTodos = store.state.todos.filter((todo) => {
    if (store.state.activehash === "/active") {
      return !todo.status;
    }
    if (store.state.activehash === "/completed") {
      return todo.status;
    }
    return true; // For "/", show all todos
  });
  store.update();
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
          console.log("New todo value:", store.state.newTodo); // Log new todo value
        },
        onkeypress: (e) => {
          if (e.key === "Enter" && store.state.newTodo.trim() !== "") {
            store.update({
              todos: [
                {
                  text: store.state.newTodo.trim(),
                  status: false,
                  id: generateUniqueID(),
                },
                ...store.state.todos,
              ],
              newTodo: "",
            });
            console.log("Todos after addition:", store.state.todos); // Log todos after addition
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
        createElement("input", {class: "toggle-all", type: "checkbox"}),
        createElement(
          "label",
          {class: "toggle-all-label", for: "toggle-all"},
          "Mark all as complete"
        )
      ),
      createElement(
        "ul",
        {class: "todo-list"},
        ...filteredTodos.map((todo) =>
          createElement(
            "li",
            {
              "data-id": todo.id,
              class: `${todo.status ? "completed" : ""}`,
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
              createElement("button", {class: "destroy"})
            )
          )
        )
      )
    ),
    store.state.todos.length
      ? createElement(
          "footer",
          {class: "footer", style: "display: block;"},
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
  store = createStore(initialState, TodoApp, rootElement);
  console.log("Initial state:", store.state); // Log initial state
});
