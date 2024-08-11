import {diff, patch} from "./dom.js";

class Store {
  #currentVNode = null;
  #updateQueue = [];
  #isUpdating = false;
  #debounceDelay = 0;

  constructor(initialState = {}, rootComponent, rootElement) {
    this.state = initialState;
    this.rootComponent = rootComponent;
    this.rootElement = rootElement;

    this.update();
  }

  update(newState = {}) {
    this.#updateQueue.push(newState);
    if (!this.#isUpdating) {
      this.#isUpdating = true;
      setTimeout(() => {
        this.#processUpdates();
      }, this.#debounceDelay);
    }
  }

  #processUpdates() {
    this.#isUpdating = false;
    const newState = Object.assign({}, ...this.#updateQueue);
    this.#updateQueue = [];
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
