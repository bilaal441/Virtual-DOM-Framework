class Router {
   activehash = ''
 
 

 

  handleRouteChange() {


    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    }
  }
}

export  default  new Router();
