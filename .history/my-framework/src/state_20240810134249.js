import {diff, patch} from "./dom.js";

class Store {
  #currentVNode = null;
  #updateQueue = [];
  #isUpdating = false;
  #debounceDelay = 100;
  constructor(initialState = {}, rootComponent, rootElement) {
    this.state = initialState;
    this.rootComponent = rootComponent;
    this.rootElement = rootElement;

    this.update();
  }

  update(newState = {}) {
    console.log("state");
    this.state = {...this.state, ...newState};

    this.#render();
    console.log(this.state);
  }

  #render() {
    const newVNode = this.rootComponent(this);
    if (this.#currentVNode) {
      const patches = diff(this.#currentVNode, newVNode);
      console.log("newnode", newVNode);
      console.log("current", this.#currentVNode);
      patch(this.rootElement, patches);
    } else {
      this.rootElement.appendChild(newVNode.render());
    }
    this.#currentVNode = newVNode;
  }
}

export function createStore(initialState, rootComponent, rootElement) {
  return new Store(initialState, rootComponent, rootElement);
}
