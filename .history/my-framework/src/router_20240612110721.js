class Router {
   activehash = ''
 
 

 

  handleRouteChange(f) {
   window.addEventListener("hashchange")



    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    }
  }
}

export  default  new Router();
