import {diff, patch} from "./dom.js";

class Store {
  constructor(initialState = {}, rootComponent, rootElement) {
    this.state = initialState;
    this.rootComponent = rootComponent;
    this.rootElement = rootElement;
    this.currentVNode = null;

    // Bind the update method to ensure correct `this` context
    this.update = this.update.bind(this);

    this.update(); // Initial render
  }

  update(newState = {}) {
    console.log(newState);
    this.state = {...this.state, ...newState};
    this.#render();
  }

  #render() {
    const newVNode = this.rootComponent(this);
    if (this.currentVNode) {
      const patches = diff(this.currentVNode, newVNode);
      patch(this.rootElement, patches);
    } else {
      this.rootElement.appendChild(newVNode.render());
    }
    this.currentVNode = newVNode;
  }
}

export function createStore(initialState, rootComponent, rootElement) {
  return new Store(initialState, rootComponent, rootElement);
}
