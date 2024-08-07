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
        if (value) {
          element.checked = true;
        } else {
          element.checked = false;
        }
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

function createElement(tag, attrs, ...children) {
  return new VNode(tag, attrs, children);
}












function patch(parent, patches, index = 0) {
  if (!patches) return;
  const element = parent?.childNodes[index];

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
      patches.newNode instanceof VNode
        ? parent.removeChild(element)
        : (parent.textContent = "");

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
      const {attrPatches, childrenPatches} = patches;
      attrPatches.forEach(({key, value}) => {
        if (value !== undefined) {
          if (key === "value") {
            element.value = value;
          } else if (key == "checked") {
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

export {createElement, diff, patch, VNode};
