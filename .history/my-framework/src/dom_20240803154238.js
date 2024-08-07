export function generateUniqueID() {
  const timestamp = Date.now();
  const randomNum = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomNum}`;
}
function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

class VNode {
  constructor(tag, attrs = {}, children = []) {
    if (tag !== "li") {
      attrs["data-id"] = generateUniqueID();
    }

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
          console.log(key, value);
          element.checked = value;
        } else {
          element.setAttribute(key, value);
        }
      }
    }

    this.children.forEach((child) => {
      const childElement =
        child instanceof VNode
          ? child.render()
          : document.createTextNode(child);
      element.appendChild(childElement);
    });

    return element;
  }
}

const eventHandlersMap = new Map();
const eventsToDelegate = [
  "click",
  "input",
  "change",
  "focus",
  "blur",
  "keypress",
  "keydown",
  "keyup",
  "dblclick",
  "keydown",
  "keypress",
  "keyup",
];

function createElement(tag, attrs, ...children) {
  const vnode = new VNode(tag, attrs, children);

  // Store event handlers
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith("on")) {
      const event = key.slice(2).toLowerCase();

      if (!eventHandlersMap.has(attrs["data-id"])) {
        eventHandlersMap.set(attrs["data-id"], {});
      }
      eventHandlersMap.get(attrs["data-id"])[event] = value;
    }
  }

  // console.log(eventHandlersMap);
  return vnode;
}

function handleEvent(event) {
  let target = event.target;

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
  if (vOldNode === undefined) {
    return {type: "CREATE", newNode: vNewNode};
  }
  if (vNewNode === undefined) {
    console.log(vNewNode, "vnewnode");
    return {type: "REMOVE", id: vOldNode.attrs["data-id"]};
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
  // console.log(parent, patches, index);
  if (!patches) return;

  const element = parent.childNodes[index];

  switch (patches.type) {
    case "CREATE": {
      if (patches.newNode instanceof VNode) {
        const newElement = patches?.newNode?.render();
        parent.appendChild(newElement);
        break;
      }

      parent.textContent = patches.newNode;
      break;
    }
    case "REMOVE": {
      const el = document.querySelector(`[data-id='${patches.id}']`);

      if (el && parent && parent.contains(el)) {
        parent.removeChild(el);
      }
      break;
    }
    case "REPLACE": {
      if (patches.newNode instanceof VNode) {
        const newElement = patches?.newNode?.render();
        parent.replaceChild(newElement, element);
        break;
      }
      parent.textContent = patches.newNode;

      break;
    }
    case "TEXT": {
      element.textContent = patches.newNode;
      break;
    }
    case "UPDATE": {
      if (!element) {
        return;
      }
      // console.log("here");
      const {attrPatches, childrenPatches} = patches;
      attrPatches.forEach(({key, value}) => {
        if (value !== undefined) {
          if (key === "value") {
            element.value = value;
          } else if (key === "checked") {
            if value{}
            element.checked = value;
            
          } else if (!key.startsWith("on")) {
            element.setAttribute(key, value);
          }
        } else {
          element.removeAttribute(key);
        }
      });

      const childNodes = Array.from(element?.childNodes);
      childrenPatches.patches.forEach((childPatch, i) => {
        patch(element, childPatch, i);
      });

      childrenPatches.additionalPatches.forEach((childPatch) => {
        patch(element, childPatch, childNodes.length);
      });

      break;
    }
    default:
      console.error("Unknown patch type:", patches.type);
  }
}

const rootElement = document.getElementById("app");
console.log(eventsToDelegate);

for (const eventType of eventsToDelegate) {
  rootElement.addEventListener(eventType, handleEvent, true);
}

export {createElement, diff, patch, VNode};
