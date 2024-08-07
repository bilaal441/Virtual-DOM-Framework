import {createElement} from "../dom.js";
import {createStore} from "../state.js";

const initialState = {
  todos: [],
  newTodo: "",
};

function TodoApp(store) {
  console.log(store.state);

  return createElement(
    "section",
    {class: "todoapp"},
    createElement(
      "header",
      {class: "header"},
      createElement("h1", {}, "todos"),
      createElement("input", {
        class: "new-todo",
        ty
        placeholder: "What needs to be done?",
        autofocus: true,
        value: store.state.newTodo,
        oninput: (e) => store.update({newTodo: e.target.value}),
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
        ...store.state.todos.map((todo, index) =>
          createElement(
            "li",
            {"data-id": index + 1, class: ""},
            createElement(
              "div",
              {class: "view"},
              createElement("input", {class: "toggle", type: "checkbox"}),
              createElement("label", {}, todo),
              createElement("button", {class: "destroy"})
            )
          )
        )
      )
    ),
    createElement(
      "footer",
      {class: "footer", style: "display: block;"},
      createElement(
        "span",
        {class: "todo-count"},
        createElement("strong", {}, store.state.todos.length),
        ` item${store.state.todos.length !== 1 ? "s" : ""} left`
      ),
      createElement(
        "ul",
        {class: "filters"},
        createElement(
          "li",
          {},
          createElement("a", {href: "#/", class: ""}, "All")
        ),
        createElement(
          "li",
          {},
          createElement("a", {href: "#/active", class: "selected"}, "Active")
        ),
        createElement(
          "li",
          {},
          createElement("a", {href: "#/completed", class: ""}, "Completed")
        )
      ),
      createElement("button", {
        class: "clear-completed",
        style: "display: none;",
      })
    )
  );
}

const rootElement = document.getElementById("app");
createStore(initialState, TodoApp, rootElement);
