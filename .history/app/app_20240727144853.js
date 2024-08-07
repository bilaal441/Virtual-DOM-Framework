import {createElement} from "./dom.js";
import {createStore} from "./state.js";
import router from "./router.js";

export function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomNum}`;
}

function getInitialHash() {
  return window.location.hash || "/";
}

const initialState = {
  todos: [],
  newTodo: "",
  activehash: getInitialHash(),
  filteredTodos: [],
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
    return true;
  });
}

router.handleRouteChange((activehash) => {
  const filteredTodos = filterTodos({...store.state, activehash});
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
    store.update({
      todos: newTodos,
      filteredTodos,
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
        ...store.state.filteredTodos.map((todo) =>
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

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("app");
  store = createStore(
    {...initialState, filteredTodos: filterTodos(initialState)},
    TodoApp,
    rootElement
  );
});
