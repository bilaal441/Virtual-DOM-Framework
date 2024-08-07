class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
       this.activehash = e.newURL.split("")
    });
  }
}

export default new Router();
