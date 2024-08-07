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
  activehash: getInitialHash(), // Set initial hash
  filteredTodos: [], // Add filteredTodos to the initial state
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

