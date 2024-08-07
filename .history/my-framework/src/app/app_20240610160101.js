import {createElement} from "../dom.js";

import {createStore} from "../state.js";
console.log("jnjknkjn");

const initialState = {
  todos: [],
  newTodo: "",
};

function TodoApp(state) {
  console.log("Rendering TodoApp with state:", state);
  return createElement(
    "div",
    {},
    createElement("h1", {}, "TodoMVC"),
    createElement("input", {
      type: "text",
      value: state.newTodo,
      oninput: (e) => store.update({newTodo: e.target.value}),
    }),
    createElement(
      "button",
      {
        onclick: () => {
          store.update({
            todos: [...state.todos, state.newTodo],
            newTodo: "",
          });
        },
      },
      "Add Todo"
    ),
    createElement(
      "ul",
      {},
      ...state.todos.map((todo) => createElement("li", {}, todo))
    )
  );
}

document.addEventListener("DOMContentLoaded", () => {
  debugger;
  const rootElement = document.getElementById("app");
  createStore(initialState, TodoApp, rootElement);
});
