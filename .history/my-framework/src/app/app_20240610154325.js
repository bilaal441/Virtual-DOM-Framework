// import {createElement} from "../dom";
// import {createStore} from "../state";

// const initialState = {
//   todos: [],
//   newTodo: "",
// };

// function TodoApp(state) {
//   console.log("Rendering TodoApp with state:", state);
//   return createElement(
//     "div",
//     {},
//     createElement("h1", {}, "TodoMVC"),
//     createElement("input", {
//       type: "text",
//       value: state.newTodo,
//       oninput: (e) => store.update({newTodo: e.target.value}),
//     }),
//     createElement(
//       "button",
//       {
//         onclick: () => {
//           store.update({
//             todos: [...state.todos, state.newTodo],
//             newTodo: "",
//           });
//         },
//       },
//       "Add Todo"
//     ),
//     createElement(
//       "ul",
//       {},
//       ...state.todos.map((todo) => createElement("li", {}, todo))
//     )
//   );
// }

// console.log("DOM fully loaded and parsed");

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed");
//   const rootElement = document.getElementById("app");
//   createStore(initialState, TodoApp, rootElement);
// });
