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
  activehash: getInitialHash(),
  isToggle: false,
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
  });
});

function TodoApp(store) {
  const debounceUpdate = (callback, delay = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  };

  const onchangeHandler = function (e) {
    // console.log(e);
    const el = e.target.closest("li");

    if (!el) return;

    const id = el.getAttribute("data-id");

    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          status: !todo.status,
        };
      }
      return todo;
    });

    e.target.checked = !e.target.checked;
    store.update({
      todos: newTodos,
    });

    console.log(el);
  };

  const ondblclickHandler = (e) => {
    console.log("Double-click detected", e.target);
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

  const todoEditHandlerHelper = (e) => {
    const el = e.target.closest("li");

    if (!el) return;
    const {id} = el.dataset;

    const newTodoText = e.target.value;
    if (!newTodoText) {
      store.update({
        todos: store.state.todos.filter((todo) => {
          return todo.id !== id;
        }),
      });

      return;
    }

    const newTodos = store.state.todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text: newTodoText,
          IsEditing: false,
        };
      }
      return todo;
    });

    store.update({
      todos: newTodos,
    });
  };

  const onblurHandler = (e) => {
    debounceUpdate(todoEditHandlerHelper)(e);
  };

  const editTodoKeydown = (e) => {
    if (e.key === "Enter") {
      debounceUpdate(todoEditHandlerHelper)(e);
    }
  };

  const deleteTodoHandler = (e) => {
    const el = e.target.closest("li");
    if (!el) return;
    const {id} = el.dataset;

    const newTodos = store.state.todos.filter((el) => {
      return el.id !== id;
    });

    store.update({
      todos: newTodos,
    });
  };

  const clearCompletedHandler = (e) => {
    const newTodos = store.state.todos.filter((el) => {
      return !el.status;
    });
    store.update({
      todos: newTodos,
    });
  };

  const filteredTodos = filterTodos(store.state);
  const IsAnyToDelete = store.state.todos.some((el) => el.status);

  const toggleHandler = (e) => {
    const newIsToggle = !store.state.isToggle;
    store.update({
      todos: store.state.todos.map((todo) => {
        return {
          ...todo,
          status: newIsToggle,
        };
      }),
      isToggle: newIsToggle,
    });
  };

  return createElement(
    "div",
    {},
    createElement(
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

          onkeydown: (e) => {
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

              store.update({
                todos: newTodos,
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
          createElement("input", {
            class: "toggle-all",
            type: "checkbox",
            checked: store.state.isToggle,
          }),
          createElement(
            "label",
            {
              onclick: toggleHandler,
              class: "toggle-all-label",
              for: "toggle-all",
            },
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
                class: `${todo.status ? "completed" : ""} ${
                  todo.IsEditing ? "editing" : ""
                }`,
                ondblclick: ondblclickHandler,
                "data-id": todo.id,

                onkeydown: editTodoKeydown,
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
      createElement(
        "footer",
        {
          class: "footer",
          style: `display: ${store.state.todos.length ? "block" : "none"}`,
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
        createElement(
          "button",
          {
            class: "clear-completed",
            style: `display: ${IsAnyToDelete ? "block" : "none"}`,
            onclick: clearCompletedHandler,
          },
          "Clear Completed"
        )
      )
    )
    f
  );
}

const footer = () => {
  return createElement(
    "footer",
    {class: "info"},
    createElement("p", {}, "Double-click to edit a todo"),
    createElement(
      "p",
      {},
      "Created by ",
      createElement(
        "a",
        {href: "http://twitter.com/oscargodson"},
        "Oscar Godson"
      )
    ),
    createElement(
      "p",
      {},
      "Refactored by ",
      createElement(
        "a",
        {href: "https://github.com/cburgmer"},
        "Christoph Burgmer"
      )
    ),
    createElement("p", {}, "Maintenanced by the TodoMVC team"),
    createElement(
      "p",
      {},
      "Part of ",
      createElement("a", {href: "http://todomvc.com"}, "TodoMVC")
    )
  );
};

// Initialize the store and render the app
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("app");
  store = createStore(
    {...initialState}, // Initialize with filteredTodos
    TodoApp,
    rootElement
  );

  console.log("Initial state:", store.state); // Log initial state
});
