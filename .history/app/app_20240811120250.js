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

  return createElement
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
