class VNode {
  constructor(tag, attrs = {}, children = []) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }

  render() {
    const element = document.createElement(this.tag);
    for (const [key, value] of Object.entries(this.attrs)) {
      if (key.startsWith("on")) {
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else if (key === "value") {
        element.value = value;
      } else if (key == "checked") {
        element.checked = value;
      } else {
        element.setAttribute(key, value);
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

function createElement(tag, attrs, ...children) {
  return new VNode(tag, attrs, children);
}

//   function handleEvent(event) {
//     let target = event.target;
//     while (target && target !== rootElement) {
//       const vnodeId = target.getAttribute('data-vnode-id');
//       if (vnodeId) {
//         const handlers = vNodeMap.get(vnodeId)?.eventHandlers;
//         if (handlers && handlers[event.type]) {
//           handlers[event.type](event); // Call the corresponding handler
//           break;
//         }
//       }
//       target = target.parentNode;
//     }
// }

function diff(vOldNode, vNewNode) {
  if (!vOldNode) {
    return {type: "CREATE", newNode: vNewNode};
  }

  if (vNewNode === null || vNewNode === undefined) {
    return {type: "REMOVE"};
  }

  if (typeof vOldNode !== typeof vNewNode || vOldNode.tag !== vNewNode.tag) {
    return {type: "REPLACE", newNode: vNewNode};
  }

  if (typeof vOldNode === "string" || typeof vOldNode === "number") {
    if (vOldNode !== vNewNode) {
      return {type: "TEXT", newNode: vNewNode};
    } else {
      return null;
    }
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

function patch(parent, patches, element) {
  switch (patches.type) {
    case "CREATE": {
      const newElement = createElement(patches.newNode);
      parent.appendChild(newElement);
      break;
    }
    case "REMOVE": {
      if (parent && element) {
        parent.removeChild(element);
      } else {
        console.error(
          "Failed to remove child: parent or element is null or undefined",
          parent,
          element
        );
      }
      break;
    }
    case "REPLACE": {
      const newElement = createElement(patches.newNode);
      if (parent && element) {
        parent.replaceChild(newElement, element);
      } else {
        console.error(
          "Failed to replace child: parent or element is null or undefined",
          parent,
          element
        );
      }
      break;
    }
    case "TEXT": {
      if (element) {
        element.textContent = patches.newNode;
      } else {
        console.error(
          "Failed to update text content: element is null or undefined",
          element
        );
      }
      break;
    }
    case "UPDATE": {
      if (element) {
        updateAttrs(element, patches.attrPatches);
        const childPatches = patches.childrenPatches;
        for (let i = 0; i < childPatches.length; i++) {
          patch(element, childPatches[i], element.childNodes[i]);
        }
      } else {
        console.error(
          "Failed to update element: element is null or undefined",
          element
        );
      }
      break;
    }
    default: {
      console.error("Unknown patch type:", patches.type);
    }
  }
}

export {createElement, diff, patch, VNode};
