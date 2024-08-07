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
  console.log(activehash);
  store?.update({
    activehash,
  });
});










const rootElement = document.getElementById("app");
store = createStore(initialState, TodoApp, rootElement);
