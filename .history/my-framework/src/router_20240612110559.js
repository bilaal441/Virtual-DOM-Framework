class Router {
  constructor() {
    act
    window.addEventListener('popstate', () => this.handleRouteChange());
  }

  addRoute(path, callback) {
    this.routes[path] = callback;
  }

  // navigate(path) {
  //   window.history.pushState({}, path, window.location.origin + path);
  //   this.handleRouteChange();
  // }

  handleRouteChange() {


    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    }
  }
}

export  default  new Router();
