export function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomNum}`;
}
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
const eventHandlersMap = new Map();
class VNode {
  constructor(tag, attrs = {}, children = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }

  render() {
    const element = document.createElement(this.tag);
    for (const [key, value] of Object.entries(this.attrs)) {
      if (!key.startsWith("on")) {
        if (key === "value") {
          element.value = value;
        } else if (key === "checked") {
          element.checked = value;
        } else {
          element.setAttribute(key, value);
        }
      }
    }
    let id;
    if (this.tag !== "li") {
      id = generateUniqueID();
      element.setAttribute("data-id", id);
    } else {
      id = this.attrs["data-id"];
    }

    this.storeEvenMap(id);

    this.children.forEach((child) => {
      const childElement =
        child instanceof VNode
          ? child.render()
          : document.createTextNode(child);
      element.appendChild(childElement);
    });

    return element;
  }

  storeEvenMap(id) {
    const {attrs} = this;
    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith("on")) {
        const event = key.slice(2).toLowerCase();
        const dataId = id;
        if (!eventHandlersMap.has(dataId)) {
          eventHandlersMap.set(dataId, {});
        }

        eventHandlersMap.get(dataId)[event] = value;
      }
    }
  }
}

function createElement(tag, attrs, ...children) {
  const vnode = new VNode(tag, attrs, children);
  return vnode;
}

function handleEvent(event) {
  let target = event.target;
  console.log(eventHandlersMap);
  while (target && target !== rootElement) {
    const vnodeId = target.getAttribute("data-id");

    if (vnodeId) {
      const handlers = eventHandlersMap.get(vnodeId);
      if (handlers && handlers[event.type]) {
        handlers[event.type](event);
        break;
      }
    }
    target = target.parentNode;
  }
}

function diff(vOldNode, vNewNode) {
  if (vOldNode === undefined && vNewNode === undefined) {
    return {type: "CREATE", newNode: vNewNode};
  }
  if (vNewNode === undefined) {
    return {type: "REMOVE"};
  }

  if (typeof vOldNode === "string" || typeof vOldNode === "number") {
    if (vOldNode !== vNewNode) {
      return {type: "TEXT", newNode: vNewNode};
    } else {
      return null;
    }
  }

  if (vOldNode.tag !== vNewNode.tag) {
    return {type: "REPLACE", newNode: vNewNode};
  }

  const attrPatches = diffAttrs(vOldNode.attrs, vNewNode.attrs);
  const childrenPatches = diffChildren(vOldNode.children, vNewNode.children);
  return {type: "UPDATE", attrPatches, childrenPatches};
}

function diffAttrs(oldAttrs, newAttrs) {
  const patches = [];

  // Compare new attributes with old attributes
  if (newAttrs) {
    for (const [key, value] of Object?.entries(newAttrs)) {
      if (oldAttrs[key] !== value) {
        patches.push({key, value});
      }
    }
  }

  // Check for removed attributes
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push({key, value: undefined});
    }
  }

  return patches;
}

function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const additionalPatches = [];

  oldChildren?.forEach((oldChild, i) => {
    patches.push(diff(oldChild, newChildren[i]));
  });

  for (let i = oldChildren?.length; i < newChildren?.length; i++) {
    additionalPatches.push({type: "CREATE", newNode: newChildren[i]});
  }

  return {patches, additionalPatches};
}

function patch(parent, patches, index = 0) {
  if (!patches) return;
  const element = parent.childNodes[index];

  switch (patches.type) {
    case "CREATE": {
      console.log(element);
      if (patches.newNode instanceof VNode) {
        const newElement = patches.newNode.render();
        parent.appendChild(newElement);
      }
      break;
    }
    case "REMOVE": {
      console.log(element);
      eventHandlersMap.delete(element.getAttribute("data-id"));
      parent.removeChild(element);

      break;
    }
    case "REPLACE": {
      if (patches.newNode instanceof VNode) {
        const newElement = patches.newNode.render();
        if (element) {
          eventHandlersMap.delete(element.getAttribute("data-id")); // Clean up event handlers
          parent.replaceChild(newElement, element);
        }
      } else {
        parent.textContent = patches.newNode;
      }
      break;
    }
    case "TEXT": {
      if (element) {
        element.textContent = patches.newNode;
      }
      break;
    }
    case "UPDATE": {
      if (element) {
        const {attrPatches, childrenPatches} = patches;

     

        const childNodes = Array.from(element.childNodes);
        const patchesQueue = [...childrenPatches.patches];

        let offset = 0;
        for (let i = 0; i < patchesQueue.length; i++) {
          const childPatch = patchesQueue[i];
          if (childPatch) {
            patch(element, childPatch, i + offset);
            if (childPatch.type === "REMOVE") {
              offset--;
            }
          }
        }

        childrenPatches.additionalPatches.forEach((childPatch) => {
          patch(element, childPatch, childNodes.length);
        });
      }
      break;
    }
    default:
      console.error("Unknown patch type:", patches.type);
  }
}

// const rootElement = document.getElementById("app");

// const eventsToDelegate = [
//   "click",
//   "input",
//   "change",
//   "focus",
//   "blur",
//   "keypress",
//   "keydown",
//   "keyup",
//   "dblclick",
// ];

// for (const eventType of eventsToDelegate) {
//   rootElement.addEventListener(eventType, handleEvent, true);
// }

export {createElement, diff, patch, VNode};
