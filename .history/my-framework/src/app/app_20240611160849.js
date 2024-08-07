import {createElement} from "../dom.js";
import {createStore} from "../state.js";

const initialState = {
  todos: [],
  newTodo: "",
};

function TodoApp(store) {
  console.log(store.state);
  return createElement(
    "div",
    {},
    createElement("h1", {}, "TodoMVC"),å
    createElement("input", {
      type: "text",
      value: store.state.newTodo,
      oninput: (e) => store.update({newTodo: e.target.value}),
    }),
    createElement(
      "button",
      {
        onclick: () => {
          store.update({
            todos: [...store.state.todos, store.state.newTodo],
            newTodo: "",
          });
        },
      },
      "Add Todo"
    ),
    createElement(
      "ul",
      {},
      ...store.state.todos.map((todo) => createElement("li", {}, todo))
    )
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("app");
  createStore(initialState, TodoApp, rootElement);
});
