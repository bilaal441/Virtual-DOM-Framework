class Router {
   activehash = ''
 
 

 

  handleRouteChange() {
   window.addEventListener()



    const path = window.location.pathname;
    if (this.routes[path]) {
      this.routes[path]();
    }
  }
}

export  default  new Router();
