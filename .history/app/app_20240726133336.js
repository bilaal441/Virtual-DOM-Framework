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
  store.update({activehash});
});

function TodoApp(store) {
  const {state, update} = store;

  const onchangeHandler = function (e) {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;

    update({
      todos: state.todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, status: !todo.status};
        }
        return todo;
      }),
    });
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.activehash === "/active") {
      return !todo.status;
    }
    if (state.activehash === "/completed") {
      return todo.status;
    }
    return true; // For "/", show all todos
  });

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
        value: state.newTodo,
        oninput: (e) => update({newTodo: e.target.value}),
        onkeypress: (e) => {
          if (e.key === "Enter" && state.newTodo.trim() !== "") {
            console.log(state.newTodo);
            update({
              todos: [
                {
                  text: state.newTodo.trim(),
                  status: false,
                  id: generateUniqueID(),
                },
                ...state.todos,
              ],
              newTodo: "",
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
    state.todos.length
      ? createElement(
          "footer",
          {class: "footer", style: "display: block;"},
          createElement(
            "span",
            {class: "todo-count"},
            createElement(
              "strong",
              {},
              state.todos.filter((todo) => !todo.status).length || "0"
            ),
            ` item${
              state.todos.filter((todo) => !todo.status).length !== 1 ? "s" : ""
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
                  class: `${state.activehash === "/" ? "selected" : ""}`,
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
                  class: `${state.activehash === "/active" ? "selected" : ""}`,
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
                    state.activehash === "/completed" ? "selected" : ""
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

const rootElement = document.getElementById("app");
store = createStore(initialState, TodoApp, rootElement);
