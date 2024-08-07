class Router {
  activehash = "";

  handleRouteChange() {
    window.addEventListener("hashchange", (e) => {
       this.activehash = e.newURL.s
    });
  }
}

export default new Router();
