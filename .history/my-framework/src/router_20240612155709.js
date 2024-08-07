// class Router {
//   constructor() {
//     this.activehash = "";
//   }

//   handleRouteChange(callback) {
//     window.addEventListener("hashchange", (e) => {
//       const hash = e.newURL.split("#")[1];
//       callback(hash);
//     });
//   }
// }

// export default new Router();

// router.js
class Router {
  constructor() {
    this.routes = {};
    this.currentHash = "";
  }

  addRoute(route, handler) {
    this.routes[route] = handler;
  }

  handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (this.currentHash !== hash) {
      this.currentHash = hash;
      this.routes[hash] && this.routes[hash]();
    }
  }

  init() {
    window.addEventListener("hashchange", this.handleHashChange.bind(this));
    this.handleHashChange(); // To handle the initial load
  }
}

export default new Router();
