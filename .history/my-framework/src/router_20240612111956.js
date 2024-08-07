class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
       this.activehash 

    });
  }
}

export default new Router();
