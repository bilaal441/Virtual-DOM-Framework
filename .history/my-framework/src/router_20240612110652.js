class Router {
   activehash = ''
 
  addRoute(path, callback) {
    this.routes[path] = callback;
  }

 

  handleRouteChange() {


    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    }
  }
}

export  default  new Router();
