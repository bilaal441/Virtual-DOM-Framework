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
  store?.update({
    activehash,
  });
});

function TodoApp(store) {
  const onchangeHandler = function (e) {
    e.target.closest("li").dataset.id
    // store.update({
    //   todos: store.state.todos.map((el) => {
    //     if (el.id === data.id) {
    //       return {
    //         ...el,
    //         status: !el.status,
    //       };
    //     }
    //     return el;
    //   }),
    // });
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
        oninput: (e) => store.update({newTodo: e.target.value}),
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
        ...store.state.todos
          .filter((el) => {
            if (store.state.activehash === "/active") {
              return el.status === false;
            } else if (store.state.activehash === "/completed") {
              return el.status === true;
            } else {
              return true;
            }
          })
          .map((el) =>
            createElement(
              "li",
              {
                "data-id": el.id,
                class: ` ${el.status ? "completed" : ""} `,
              },
              createElement(
                "div",
                {class: "view"},
                createElement("input", {
                  class: "toggle",
                  type: "checkbox",
                  checked: el.status,
                  onchange: onchangeHandler,
                }),
                createElement("label", {}, el.text),
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
              store?.state?.todos.filter((el) => !el.status)?.length || "0"
            ),
            ` item${
              store?.state?.todos.filter((el) => !el.status).length !== 1
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
                  } `,
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

const rootElement = document.getElementById("app");
store = createStore(initialState, TodoApp, rootElement);
